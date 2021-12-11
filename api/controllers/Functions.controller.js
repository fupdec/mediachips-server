const db = require("../index.js");
const VideoMetadata = db.VideoMetadata;
const Media = db.Media;
const Settings = db.Settings;
const MetaSettings = db.MetaSettings;
const Meta = db.Meta;
const Items = db.Items;
const ItemsInItems = db.ItemsInItems;
const ItemsInMedia = db.ItemsInMedia;
const ValuesInMedia = db.ValuesInMedia;
const ValuesInItems = db.ValuesInItems;
const MetaInMediaTypes = db.MetaInMediaTypes;
const Playlists = db.Playlists;
const VideosInPlaylist = db.VideosInPlaylist;
const Markers = db.Markers;
const Op = db.Sequelize.Op;

// importing old database from JSON
exports.importDatabase = async (req, res) => {
  if (!req.body) return res.sendStatus(400)
  Media.bulkCreate(req.body.videos).then(async () => {
    await VideoMetadata.bulkCreate(req.body.videoMetadata)
    // for (let video of req.body.videoMetadata) {
    //   const media = await Media.findOne({ where: { oldId: video.oldId } })
    //   if (media === null) continue
    //   else await VideoMetadata.create({...{mediaId:media.id}, ...video})
    // }
  }).then(async () => {
    await Settings.update(req.body.settings, {
      where: {
        id: 1
      }
    })
  }).then(async () => {
    await Meta.bulkCreate(req.body.meta)
    for (let m of req.body.metaSettings) {
      const foundMeta = await Meta.findOne({
        where: {
          oldId: m.oldId
        }
      })
      if (foundMeta) await MetaSettings.create({
        ...m,
        ...{
          metaId: foundMeta.id
        }
      })
    }
    for (let items of req.body.items) {
      for (let i in items) {
        const meta = await Meta.findOne({
          where: {
            oldId: i
          }
        })
        if (meta) {
          let newItems = items[i].map(it => ({
            ...{
              metaId: meta.id
            },
            ...it
          }))
          await Items.bulkCreate(newItems)
        }
      }
    }
  }).then(async () => {
    for (let i of req.body.settings.metaAssignedToVideos) {
      const meta = await Meta.findOne({
        where: {
          oldId: i.id
        }
      })
      if (meta === null) continue
      else await MetaInMediaTypes.create({
        typeId: 1,
        metaId: meta.id
      })
    }
  }).then(async () => {
    await Playlists.bulkCreate(req.body.playlists)
  }).then(async () => {
    for (let playlist of req.body.playlists) {
      const p = await Playlists.findOne({
        where: {
          oldId: playlist.oldId
        }
      })
      if (p === null) continue
      for (let i of playlist.videos) {
        const media = await Media.findOne({
          where: {
            oldId: i
          }
        })
        if (media === null) continue
        else await VideosInPlaylist.create({
          playlistId: p.id,
          mediaId: media.id
        })
      }
    }
  }).then(async () => {
    for (let marker of req.body.markers) {
      const media = await Media.findOne({
        where: {
          oldId: marker.videoId
        }
      })
      if (media === null) continue
      else marker.mediaId = media.id
      if (marker.type === 'meta') {
        const metaItem = await Items.findOne({
          where: {
            oldId: marker.oldItemId
          }
        })
        if (media === null) continue
        else marker.itemId = metaItem.id
      }
      await Markers.create(marker)
    }
  }).then(async () => { // meta in videos
    for (let videoMeta of req.body.onlyMeta) {
      const mVideo = await Media.findOne({
        where: {
          oldId: videoMeta.id
        }
      })
      if (mVideo === null) continue

      let onlyMetaFields = Object.fromEntries(Object.entries(videoMeta).filter(([key]) => !key.includes('id')))
      for (let fieldName in onlyMetaFields) {
        const m = await Meta.findOne({
          where: {
            oldId: fieldName
          }
        })
        if (m === null) continue
        else {
          let val = onlyMetaFields[fieldName]
          if (m.dataType === 'array') {
            for (let item of val) {
              const metaItem = await Items.findOne({
                where: {
                  oldId: item
                }
              })
              if (metaItem === null) continue
              else {
                try {
                  await ItemsInMedia.create({
                    metaId: m.id,
                    mediaId: mVideo.id,
                    itemId: metaItem.id
                  })
                } catch (e) {
                  console.log('Query error: ', e)
                }
              }
            }
          } else {
            try {
              await ValuesInMedia.create({
                value: val,
                metaId: m.id,
                mediaId: mVideo.id,
              })
            } catch (e) {
              console.log('Query error: ', e)
            }
          }
        }
      }
    }
  }).then(async () => { // meta in metaItems
    for (let card of req.body.metaInItems) {
      for (let cardId in card) {
        const metaItem = await Items.findOne({
          where: {
            oldId: cardId
          }
        })
        if (metaItem === null) continue
        for (let key in card[cardId]) {
          const metaOfItem = await Meta.findOne({
            where: {
              oldId: key
            }
          })
          if (metaOfItem === null) continue
          let val = card[cardId][key]
          if (metaOfItem.dataType === 'array') {
            for (let itemOldId of val) {
              const childItem = await Items.findOne({
                where: {
                  oldId: itemOldId
                }
              })
              if (childItem === null) continue
              else {
                try {
                  await ItemsInItems.create({
                    itemId: metaItem.id,
                    childItemId: childItem.id
                  })
                } catch (e) {
                  console.log('Query error: ', e)
                }
              }
            }
          } else {
            try {
              await ValuesInItems.create({
                value: val,
                metaId: metaOfItem.id,
                itemId: metaItem.id
              })
            } catch (e) {
              console.log('Query error: ', e)
            }
          }
        }
      }
    }
    res.status(201).send({
      message: "All data has been successfully imported."
    })
  }).catch(e => {
    console.log(e)
  })
};