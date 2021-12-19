const db = require("../index.js");
// Models
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
// FFMPEG
const ffmpeg = require('fluent-ffmpeg')
const pathToFfmpeg = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked')
const pathToFfprobe = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked')
ffmpeg.setFfmpegPath(pathToFfmpeg)
ffmpeg.setFfprobePath(pathToFfprobe)

const fs = require("fs")
const path = require('path')
const StreamZip = require('node-stream-zip')

// importing old database from JSON
exports.importDatabase = async (req, res) => {
  if (!req.body) return res.sendStatus(400)

  const userfiles = path.join(__dirname, '../../userfiles')
  const mediaPath = path.join(userfiles, '/media')
  const tempPath = path.join(userfiles, '/temp')
  if (!fs.existsSync(mediaPath)) fs.mkdirSync(mediaPath)
  if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath)

  const backupPath = path.join(req.body.path)
  const zip = new StreamZip.async({
    file: backupPath
  })

  await zip.extract(null, tempPath).catch(e => {
    console.log(e)
    res.status(400).send(e)
  });
  await zip.close();

  function createImportObject() {
    const Videos = require(path.join(tempPath, 'databases', 'dbv.json'))
    const Playlists = require(path.join(tempPath, 'databases', 'dbpl.json'))
    const Markers = require(path.join(tempPath, 'databases', 'dbm.json'))
    const Meta = require(path.join(tempPath, 'databases', 'meta.json'))
    const Settings = require(path.join(tempPath, 'dbs.json'))

    let obj = {
      meta: [],
      metaSettings: [],
      items: [],
      videos: [],
      videoMetadata: [],
      playlists: [],
      markers: [],
      onlyMeta: [],
      metaInItems: [],
      settings: Settings
    }
    obj.videos = Videos.videos.map(i => ({
      oldId: i.id,
      path: i.path,
      filesize: i.size,
      rating: i.rating || 0,
      favorite: i.favorite || false,
      bookmark: i.bookmark || null,
      views: i.views || 0,
      typeId: 1,
      createdAt: (new Date(i.date).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
      updatedAt: (new Date(i.edit).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
    }))
    obj.videoMetadata = Videos.videos.map((i, x) => ({
      // oldId: i.id, // its needed for parsing
      mediaId: x + 1,
      duration: i.duration,
      width: +i.resolution.match(/\d*/)[0] || 0,
      height: +i.resolution.match(/\x(.*)/)[1] || 0,
    }))
    obj.playlists = Playlists.playlists.map(i => ({
      oldId: i.id,
      name: i.name,
      favorite: i.favorite || false,
      videos: i.videos || [],
      createdAt: (new Date(i.date).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
      updatedAt: (new Date(i.edit).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
    }))
    obj.markers = Markers.markers.map(i => ({
      time: i.time,
      videoId: i.videoId,
      text: ['favorite', 'bookmark'].includes(i.type.toLowerCase()) ? i.name : null,
      type: ['favorite', 'bookmark'].includes(i.type.toLowerCase()) ? i.type.toLowerCase() : 'meta',
      oldItemId: ['favorite', 'bookmark'].includes(i.type.toLowerCase()) ? null : i.name,
    }))
    // get meta
    for (let m of Meta.meta) {
      if (m.type === 'specific') continue
      if (m.type === 'simple') {
        let sm = {
          oldId: m.id,
          dataType: m.dataType,
          name: m.settings.name,
          nameSingular: m.settings.name,
          icon: m.settings.icon || 'shape',
          hint: m.settings.hint || '',
          createdAt: (new Date(m.date).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
          updatedAt: (new Date(m.edit).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
        }
        obj.meta.push(sm)
        if (m.dataType === 'array') {
          let items = m.settings.items.map(i => ({
            oldId: i.id,
            name: i.name,
          }))
          obj.items.push({
            [m.id]: items
          })
          obj.metaSettings.push({
            "oldId": m.id,
            "hidden": true,
            "parser": false,
            "imageAspectRatio": 1,
            "imageTypes": "main",
            "chipLabel": false,
            "chipOutlined": false,
            "color": false,
            "favorite": true,
            "rating": false,
            "synonyms": false,
            "bookmark": false,
            "country": false,
            "career": false,
            "scraper": false,
            "nested": false,
            "markers": false,
          })
        }
      } else if (m.type === 'complex') {
        let cm = {
          oldId: m.id,
          dataType: 'array',
          name: m.settings.name,
          nameSingular: m.settings.nameSingular,
          icon: m.settings.icon || 'shape',
          hint: m.settings.hint || '',
          createdAt: (new Date(m.date).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
          updatedAt: (new Date(m.edit).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
        }
        obj.meta.push(cm)
        let metaSettings = m.settings
        delete metaSettings.metaInCard
        metaSettings.oldId = m.id
        let imageTypes = metaSettings.imageTypes ? metaSettings.imageTypes.join() : "main"
        metaSettings.imageTypes = imageTypes
        obj.metaSettings.push(metaSettings)
        let cards = Meta.cards.filter(card => card.metaId == m.id).map(i => ({
          oldId: i.id,
          name: i.meta.name,
          synonyms: i.meta.synonyms ? i.meta.synonyms.join() : null,
          rating: i.meta.rating || 0,
          favorite: i.meta.favorite || false,
          bookmark: i.meta.bookmark || null,
          country: i.meta.country ? i.meta.country.join() : null,
          color: i.meta.color || null,
          views: i.views || 0,
          createdAt: (new Date(i.date).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
          updatedAt: (new Date(i.edit).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
        }))
        obj.items.push({
          [m.id]: cards
        })
        const metaKeys = ['name', 'synonyms', 'favorite', 'rating', 'bookmark', 'country', 'color']
        Meta.cards.filter(card => card.metaId == m.id).slice(0, 10).map(i => {
          let metas = Object.fromEntries(Object.entries(i.meta).filter(([key]) => !metaKeys.includes(key)))
          obj.metaInItems.push({
            [i.id]: metas
          })
        })
      }
    }
    // get videos meta values and meta items 
    const videoKeys = ['path', 'duration', 'size', 'rating', 'favorite', 'date', 'resolution', 'edit', 'views', 'viewed', 'bookmark']
    obj.onlyMeta = Videos.videos.slice(0, 100).map(i =>
      Object.fromEntries(Object.entries(i).filter(([key]) => !videoKeys.includes(key)))
    )
    return obj
  }

  let obj = createImportObject()

  // move thumbs and meta images
  const thumbsOld = path.join(tempPath, 'media/thumbs')
  const thumbsNew = path.join(userfiles, 'media/thumbs')
  const metaOld = path.join(tempPath, 'media/meta')
  const metaNew = path.join(userfiles, 'media/meta')
  fs.rename(thumbsOld, thumbsNew, function (err) {
    if (err) console.log(err) 
  })
  fs.rename(metaOld, metaNew, function (err) {
    if (err) console.log(err) 
  })
  fs.rmSync(tempPath, { recursive: true, force: true })

  Media.bulkCreate(obj.videos).then(async () => {
    await VideoMetadata.bulkCreate(obj.videoMetadata)
    // for (let video of obj.videoMetadata) {
    //   const media = await Media.findOne({ where: { oldId: video.oldId } })
    //   if (media === null) continue
    //   else await VideoMetadata.create({...{mediaId:media.id}, ...video})
    // }
  }).then(async () => {
    await Settings.update(obj.settings, {
      where: {
        id: 1
      }
    })
  }).then(async () => {
    await Meta.bulkCreate(obj.meta)
    for (let m of obj.metaSettings) {
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
    for (let items of obj.items) {
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
    for (let i of obj.settings.metaAssignedToVideos) {
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
    await Playlists.bulkCreate(obj.playlists)
  }).then(async () => {
    for (let playlist of obj.playlists) {
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
    for (let marker of obj.markers) {
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
    for (let videoMeta of obj.onlyMeta) {
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
    for (let card of obj.metaInItems) {
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
    res.status(400).send(e)
  })
};

exports.createThumb = async (req, res) => {
  /** 
   * Creating an image by taking a frame from a video.
   * @param {string} timestamp - time in the video, in the format 00:00:00.
   * @param {string} inputPath - full path to the video file.
   * @param {string} outputPath - full path to the generated image with the extension and file name.
   * @param {number} width - width of thumbnail in pixels.
   */
  function createThumb(timestamp, inputPath, outputPath, width) {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .addOption('-ss', timestamp)
        .addOption('-i', inputPath)
        .addOption('-frames:v', '1')
        .addOption('-vf', `scale=-1:${width}`)
        .save(outputPath)
        .on('end', (e) => {
          resolve(e)
        })
        .on('error', (e) => {
          reject(e)
        })
    })
  }

  if (!fs.existsSync(req.body.inputPath)) {
    res.status(400).send({
      message: "The video does not exist."
    })
    return
  }

  if (!req.body.overwrite && fs.existsSync(req.body.outputPath)) {
    res.status(400).send({
      message: "The image already exists."
    })
    return
  }

  let outputPath = path.join(
    __dirname,
    '../../',
    req.body.outputPath
  )
  createThumb(req.body.timestamp, req.body.inputPath, outputPath, req.body.width)
    .then(thumbResult => {
      res.status(201).send(thumbResult)
    })
    .catch(e => {
      console.log(e)
      res.status(400).send(e)
    })
};