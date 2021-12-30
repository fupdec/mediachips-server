const {
  VideoMetadata,
  Media,
  Setting,
  MetaSetting,
  Meta,
  Item,
  ItemsInItem,
  ItemsInMedia,
  ValuesInMedia,
  ValuesInItem,
  MetaInMediaType,
  PageSetting,
  Playlist,
  VideosInPlaylist,
  Marker,
  ChildMeta
} = require("../index.js");

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

  let itemsIds = []
  let metaIds = []
  let mediaIds = []

  const userfiles = path.join(__dirname, '../../userfiles')
  const tempPath = path.join(userfiles, '/temp')
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

  // move thumbs and meta images
  const thumbsOld = path.join(tempPath, 'media/thumbs')
  const thumbsNew = path.join(userfiles, 'media/thumbs')
  const metaOld = path.join(tempPath, 'media/meta')
  const metaNew = path.join(userfiles, 'media/meta')
  if (fs.existsSync(thumbsOld)) {
    fs.rename(thumbsOld, thumbsNew, function (err) {
      if (err) console.log(err)
    })
  }
  if (fs.existsSync(metaOld)) {
    fs.rename(metaOld, metaNew, function (err) {
      if (err) console.log(err)
    })
  }

  function createImportObject() {
    return new Promise((resolve) => {
      const Videos = require(path.join(tempPath, 'databases', 'dbv.json'))
      const Playlists = require(path.join(tempPath, 'databases', 'dbpl.json'))
      const Markers = require(path.join(tempPath, 'databases', 'dbm.json'))
      const Meta = require(path.join(tempPath, 'databases', 'meta.json'))
      const Settings = require(path.join(tempPath, 'dbs.json'))

      let obj = {
        meta: [],
        items: [],
        videos: [],
        videoMetadata: [],
        playlists: [],
        markers: [],
        onlyMeta: [],
        metaInItems: [],
        childMeta: [],
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
        oldId: i.id, // its needed for parsing
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
            type: m.dataType,
            name: m.settings.name,
            nameSingular: m.settings.name,
            icon: m.settings.icon || 'shape',
            hint: m.settings.hint || '',
            createdAt: (new Date(m.date).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
            updatedAt: (new Date(m.edit).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
            metaSetting: {
              ...{
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
              },
              ...m.settings
            },
            pageSetting: m.dataType == "array" ? {
              page: 1
            } : null,
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
          }
        } else if (m.type === 'complex') {
          let cm = {
            oldId: m.id,
            type: 'array',
            name: m.settings.name,
            nameSingular: m.settings.nameSingular,
            icon: m.settings.icon || 'shape',
            hint: m.settings.hint || '',
            createdAt: (new Date(m.date).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
            updatedAt: (new Date(m.edit).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
          }
          let metaSettings = m.settings
          if (metaSettings.metaInCard) {
            obj.childMeta.push({
              metaId: m.id,
              childMetaId: metaSettings.metaInCard.map(i => i.id),
              scraperField: metaSettings.metaInCard.map(i => i.scraperField),
            })
          }
          delete metaSettings.metaInCard
          metaSettings.oldId = m.id
          if (metaSettings.imageTypes) {
            if (metaSettings.imageTypes.length == 0) metaSettings.imageTypes = "main"
            else metaSettings.imageTypes = metaSettings.imageTypes.join()
          }
          cm.metaSetting = metaSettings
          cm.pageSetting = {
            page: 1
          }
          obj.meta.push(cm)
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
          Meta.cards.filter(card => card.metaId == m.id).map(i => {
            let metas = Object.fromEntries(Object.entries(i.meta).filter(([key]) => !metaKeys.includes(key)))
            obj.metaInItems.push({
              [i.id]: metas
            })
          })
        }
      }
      // get videos meta values and meta items 
      const videoKeys = ['path', 'duration', 'size', 'rating', 'favorite', 'date', 'resolution', 'edit', 'views', 'viewed', 'bookmark']
      obj.onlyMeta = Videos.videos.map(i =>
        Object.fromEntries(Object.entries(i).filter(([key]) => !videoKeys.includes(key)))
      )
      resolve(obj)
    })
  }

  const obj = await createImportObject()

  Media.bulkCreate(obj.videos).then(async () => {
    mediaIds = await Media.findAll({
      attributes: ['id', 'oldId'],
      raw: true
    })

    let videoMetadata = []
    for (let video of obj.videoMetadata) {
      let media = mediaIds.find(x => x.oldId === video.oldId)
      if (!media) continue
      else videoMetadata.push({
        ...{
          mediaId: media.id
        },
        ...video
      })
    }
    await VideoMetadata.bulkCreate(videoMetadata)
  }).then(async () => {
    const defaultSettings = require('../../default-settings.json')
    const settings = obj.settings
    let allowed = defaultSettings.default.map(i => i.option)

    const filteredOptions = Object.keys(settings)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = settings[key];
        return obj;
      }, {});

    let options = []
    for (let option in filteredOptions) {
      let value = filteredOptions[option]
      console.log(typeof value)
      options.push({
        option: option,
        value: value
      })
    }

    await Setting.bulkCreate(options, {
      updateOnDuplicate: ["value"]
    })
  }).then(async () => {
    // importing meta
    for (let m of obj.meta) {
      await Meta.create(m, {
        include: [MetaSetting, PageSetting]
      }).catch(e => {
        console.log(e)
      })
    }
    // getting all old ids for meta
    metaIds = await Meta.findAll({
      attributes: ['id', 'oldId', 'type'],
      raw: true
    })

    for (let items of obj.items) {
      for (let i in items) {
        const meta = metaIds.find(x => x.oldId === i)
        if (!meta) continue

        let newItems = items[i].map(it => ({
          ...{
            metaId: meta.id
          },
          ...it
        }))
        await Item.bulkCreate(newItems)
      }
    }

    itemsIds = await Item.findAll({
      attributes: ['id', 'oldId'],
      raw: true
    })
  }).then(async () => {
    for (let i of obj.settings.metaAssignedToVideos) {
      const meta = metaIds.find(x => x.oldId === i.id)
      if (!meta) continue
      await MetaInMediaType.create({
        typeId: 1,
        metaId: meta.id
      })
    }
  }).then(async () => {
    await Playlist.bulkCreate(obj.playlists)
  }).then(async () => {
    for (let playlist of obj.playlists) {
      const p = await Playlist.findOne({
        where: {
          oldId: playlist.oldId
        }
      })
      if (p === null) continue
      for (let i of playlist.videos) {
        let media = mediaIds.find(x => x.oldId === i)
        if (!media) continue
        else await VideosInPlaylist.create({
          playlistId: p.id,
          mediaId: media.id
        })
      }
    }
  }).then(async () => {
    let markers = []
    for (let marker of obj.markers) {
      let found = mediaIds.find(x => x.oldId === marker.videoId)
      if (!found) continue
      marker.mediaId = found.id
      if (marker.type === 'meta') {
        let foundItem = itemsIds.find(x => x.oldId === marker.oldItemId)
        if (!foundItem) continue
        else marker.itemId = foundItem.id
      }
      markers.push(marker)
    }
    await Marker.bulkCreate(markers)
  }).then(async () => { // meta in videos
    let itemsInMedia = []
    let valuesInMedia = []
    for (let videoMeta of obj.onlyMeta) {
      let mVideo = mediaIds.find(x => x.oldId === videoMeta.id)
      if (!mVideo) continue

      let onlyMetaFields = Object.fromEntries(Object.entries(videoMeta).filter(([key]) => !key.includes('id')))
      for (let fieldName in onlyMetaFields) {
        let m = metaIds.find(x => x.oldId === fieldName)
        if (!m) continue
        else {
          let val = onlyMetaFields[fieldName]
          if (m.type === 'array') {
            for (let item of val) {
              let metaItem = itemsIds.find(x => x.oldId === item)
              if (!metaItem) continue
              else {
                itemsInMedia.push({
                  metaId: m.id,
                  mediaId: mVideo.id,
                  itemId: metaItem.id
                })
              }
            }
          } else {
            valuesInMedia.push({
              value: val,
              metaId: m.id,
              mediaId: mVideo.id,
            })
          }
        }
      }
    }
    await ItemsInMedia.bulkCreate(itemsInMedia)
    await ValuesInMedia.bulkCreate(valuesInMedia)
  }).then(async () => {
    let childMeta = []
    let cm = obj.childMeta
    for (let c of cm) {
      let meta = metaIds.find(x => x.oldId === c.metaId)
      if (!meta) continue

      for (let id of c.childMetaId) {
        let child = metaIds.find(x => x.oldId === id)
        if (!child) continue

        childMeta.push({
          metaId: meta.id,
          childMetaId: child.id,
          scraperField: null,
        })
      }
    }

    await ChildMeta.bulkCreate(childMeta)
  }).then(async () => { // meta in metaItems
    let itemsInItem = []
    let valuesInItem = []
    for (let card of obj.metaInItems) {
      for (let cardId in card) {
        let metaItem = itemsIds.find(x => x.oldId === cardId)
        if (!metaItem) continue

        for (let key in card[cardId]) {
          let metaOfItem = metaIds.find(x => x.oldId === key)
          if (!metaOfItem) continue

          let val = card[cardId][key]
          if (metaOfItem.type === 'array') {
            for (let itemOldId of val) {
              let childItem = itemsIds.find(x => x.oldId === itemOldId)
              if (!childItem) continue
              else {
                itemsInItem.push({
                  itemId: metaItem.id,
                  childItemId: childItem.id
                })
              }
            }
          } else {
            if (val !== 0 && val !== '')
              valuesInItem.push({
                value: val,
                metaId: metaOfItem.id,
                itemId: metaItem.id
              })
          }
        }
      }
    }
    await ItemsInItem.bulkCreate(itemsInItem)
    await ValuesInItem.bulkCreate(valuesInItem)
  }).then(() => {
    for (let id of metaIds) { // creating folders for meta images
      let folderMetaOldId = path.join(metaNew, id.oldId)
      let folderMetaNewId = path.join(metaNew, `${id.id}`)

      if (fs.existsSync(folderMetaOldId)) {
        fs.rename(folderMetaOldId, folderMetaNewId, function () {})
      }
    }
  }).then(() => {
    let tree = [];

    function mapDir(dir) {
      fs.readdirSync(dir).forEach(file => {
        const abs = path.join(dir, file);
        if (fs.statSync(abs).isDirectory()) return mapDir(abs);
        else return tree.push(abs);
      });
    }

    mapDir(metaNew)

    function replaceMetaId(name) {
      const types = ["_main", "_alt", "_custom1", "_custom2", "_avatar", "_header"]
      for (let type of types) {
        if (!name.includes(type)) continue
        let oldId = name.replace(type, '')
        let found = itemsIds.find(x => x.oldId === oldId)
        if (!found) continue
        name = found.id + type
        break
      }
      return name
    }

    for (let imgPath of tree) { // renaming meta images
      // getting image name with type from path e.g. _main, _alt, _custom1
      let nameOld = path.basename(imgPath, path.extname(imgPath))
      // finding new id of meta
      let nameNew = replaceMetaId(nameOld)
      let newPath = imgPath.replace(nameOld, nameNew)
      if (fs.existsSync(imgPath)) {
        fs.rename(imgPath, newPath, function () {})
      }
    }

    mapDir(thumbsNew)

    function replaceMediaId(name) {
      let found = mediaIds.find(x => x.oldId === name)
      if (found) return found.id
      else return name
    }

    for (let imgPath of tree) { // renaming media images
      let nameOld = path.basename(imgPath, path.extname(imgPath))
      let nameNew = replaceMediaId(nameOld)
      let newPath = imgPath.replace(nameOld, nameNew)
      if (fs.existsSync(imgPath)) {
        fs.rename(imgPath, newPath, function () {})
      }
    }

    fs.rmSync(tempPath, {
      recursive: true,
      force: true
    })

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