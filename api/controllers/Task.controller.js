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
  Mark,
  ChildMeta,
  SavedFilter
} = require("../index.js");

const os = require('os')
const fs = require("fs")
const path = require('path')
const StreamZip = require('node-stream-zip')

// importing old database from JSON
exports.importDatabase = async (req, res) => {
  if (!req.body) return res.sendStatus(400)

  // TODO import filters with new filtering system
  let itemsIds = []
  let metaIds = []
  let mediaIds = []

  const userfiles = path.join(__dirname, '../../userfiles')
  const tempPath = path.join(userfiles, '/temp')
  if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath)

  const backupPath = path.join(req.body.path)
  const ext = path.extname(backupPath)
  if (!fs.existsSync(backupPath) || ext !== '.zip') {
    res.status(400).send({
      message: "Invalid path or file does not exist"
    })
    return
  }

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
      const Marks = require(path.join(tempPath, 'databases', 'dbm.json'))
      const Meta = require(path.join(tempPath, 'databases', 'meta.json'))
      const Settings = require(path.join(tempPath, 'dbs.json'))

      let obj = {
        meta: [],
        items: [],
        videos: [],
        videoMetadata: [],
        playlists: [],
        marks: [],
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
        duration: i.duration || 0,
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
      obj.marks = Marks.markers.map(i => ({
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
            nameSingular: m.settings.name || null,
            icon: m.settings.icon || 'shape',
            hint: m.settings.hint || null,
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
                "marks": false,
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
            hint: m.settings.hint || null,
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
          metaSettings.marks = metaSettings.markers
          cm.metaSetting = metaSettings
          cm.pageSetting = {
            page: 1
          }
          obj.meta.push(cm)
          let cards = Meta.cards.filter(card => card.metaId == m.id).map(i => ({
            oldId: i.id,
            name: i.meta.name,
            synonyms: i.meta.synonyms ? i.meta.synonyms.join(', ') : null,
            rating: i.meta.rating || 0,
            favorite: i.meta.favorite || false,
            bookmark: i.meta.bookmark || null,
            country: i.meta.country ? i.meta.country.join() : null,
            color: i.meta.color || null,
            views: i.views || 0,
            createdAt: (new Date(i.date).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
            updatedAt: (new Date(i.edit).toISOString()).replace('T', ' ').replace('Z', ' +00:00'),
          }))
          for (let z of cards) {
            for (let y in z) {
              if (typeof z[y] == 'string' && z[y].length == 0) delete z[y]
              else if (z[y] === 0 || z[y] === '0') delete z[y]
              else if (z[y] === null) delete z[y]
            }
          }
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
      for (let z of obj.onlyMeta) {
        for (let y in z) {
          if (typeof z[y] == 'string' && z[y].length == 0) delete z[y]
          else if (z[y] === 0 || z[y] === '0') delete z[y]
          else if (z[y] === null) delete z[y]
        }
      }
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
    const Settings = require('../../default-settings')
    const settings = obj.settings
    let allowed = Settings.map(i => i.option)

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
      }).then(async cm => {
        if (cm.type === 'array') {
          const [cf, isC] = await SavedFilter.findOrCreate({
            where: {
              name: null,
              metaId: cm.id
            }
          })

          if (isC) {
            await PageSetting.update({
              filterId: cf.id
            }, {
              where: {
                metaId: cm.id
              }
            })
          }
        }
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
    // }).then(async () => {
    //   await Playlist.bulkCreate(obj.playlists)
    // }).then(async () => {
    // TODO Remake playlist with meta
    // for (let playlist of obj.playlists) {
    //   const p = await Playlist.findOne({
    //     where: {
    //       oldId: playlist.oldId
    //     }
    //   })
    //   if (p === null) continue
    //   for (let i of playlist.videos) {
    //     let media = mediaIds.find(x => x.oldId === i)
    //     if (!media) continue
    //     else await VideosInPlaylist.create({
    //       playlistId: p.id,
    //       mediaId: media.id
    //     })
    //   }
    // }
  }).then(async () => {
    let marks = []
    for (let mark of obj.marks) {
      let found = mediaIds.find(x => x.oldId === mark.videoId)
      if (!found) continue
      mark.mediaId = found.id
      if (mark.type === 'favorite' && mark.text === '') mark.text = null
      else if (mark.type === 'meta') {
        let foundItem = itemsIds.find(x => x.oldId === mark.oldItemId)
        if (!foundItem) continue
        else mark.itemId = foundItem.id
      }
      marks.push(mark)
    }
    await Mark.bulkCreate(marks)
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
          } else if (val !== null && val !== '' && val !== 0 && val !== '0') {
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
  }).then(async () => { // items in meta items
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
              let item = itemsIds.find(x => x.oldId === itemOldId)
              if (item) {
                itemsInItem.push({
                  parentItemId: metaItem.id,
                  itemId: item.id,
                  metaId: metaOfItem.id,
                })
              }
            }
          } else if (val !== null && val !== '' && val !== 0 && val !== '0') {
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


// FFMPEG
const ffmpeg = require('fluent-ffmpeg')
const pathToFfmpeg = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked')
const pathToFfprobe = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked')
ffmpeg.setFfmpegPath(pathToFfmpeg)
ffmpeg.setFfprobePath(pathToFfprobe)

const getMediaPath = (outputPath) => {
  return path.join(
    __dirname,
    '../../',
    outputPath
  )
}

exports.checkFileExists = async (req, res) => {
  let filePath = path.join(req.body.path)
  if (req.body.isMedia) filePath = getMediaPath(filePath)
  if (fs.existsSync(filePath)) res.sendStatus(201)
  else res.sendStatus(400)
}

exports.getFileList = async (req, res) => {
  function findInDir(dir, regex, fileList = []) {
    let files
    try {
      files = fs.readdirSync(dir)
    } catch (err) {
      files = []
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(dir, file)
      let fileStat
      try {
        fileStat = fs.lstatSync(filePath)
      } catch (err) {
        continue
      }

      if (fileStat.isDirectory()) findInDir(filePath, regex, fileList)
      else if (regex.test(filePath.toLowerCase())) fileList.push(filePath)
    }

    return fileList
  }

  const entryPath = path.join(req.body.path);
  const regexObj = JSON.parse(req.body.filter);
  const regex = new RegExp(regexObj);

  // getting stat by path
  let fileStat
  try {
    fileStat = fs.lstatSync(entryPath)
  } catch (error) {
    res.status(400).send({
      message: error
    })
    return
  }

  // check if file or directory exists
  if (fileStat.isFile() && regex.test(entryPath.toLowerCase())) {
    res.status(201).send([entryPath])
    return
  } else if (!fileStat.isDirectory()) {
    res.status(400).send({
      message: "not directory"
    })
    return
  }

  let fileList = findInDir(entryPath, regex)
  res.status(201).send(fileList)
}

exports.addMediaVideo = async (req, res) => {
  function getVideoMetadata(pathToFile) {
    return new Promise((resolve, reject) => {
      return ffmpeg.ffprobe(pathToFile, (error, info) => {
        if (error) reject(error)
        else if (info.format.duration < 1) reject('duration less than 1 sec.')
        else resolve(info)
      })
    })
  }

  function createThumb(pathToFile, id) {
    return new Promise((resolve, reject) => {
      let outputPathThumbs = getMediaPath("/userfiles/media/thumbs/")
      ffmpeg()
        .input(pathToFile)
        .screenshots({
          count: 1,
          filename: `${id}.jpg`,
          folder: outputPathThumbs,
          size: '?x320'
        })
        .on('end', () => {
          resolve('success')
        })
        .on('error', (err) => {
          reject(err.message)
        })
    })
  }

  let pathToFile = req.body.path
  let videoInfo = {}
  try {
    videoInfo = await getVideoMetadata(pathToFile)
  } catch (error) {
    res.status(400).send({
      message: error
    })
  }

  function getVideoInfo(info) {
    let duration = Math.floor(info.format.duration)

    let width, height, codec, fps
    for (let stream of info.streams) {
      if (stream.codec_type !== 'video') continue
      width = stream.width
      height = stream.height
      codec = stream.codec_name
      fps = Math.ceil(stream.nb_frames / info.format.duration)
      break
    }

    return {
      filesize: info.format.size,
      duration: duration,
      bitrate: info.format.bit_rate,
      width,
      height,
      codec,
      fps,
    }
  }

  const {
    filesize,
    duration,
    bitrate,
    width,
    height,
    codec,
    fps,
  } = getVideoInfo(videoInfo)

  const [media, isCreated] = await Media.findOrCreate({
    where: {
      path: pathToFile,
    },
    defaults: {
      filesize,
      typeId: 1,
    },
  })

  if (isCreated) {
    await VideoMetadata.create({
      mediaId: media.id,
      duration,
      bitrate,
      width,
      height,
      codec,
      fps,
    })

    try {
      await createThumb(pathToFile, media.id)
    } catch (error) {
      res.status(400).send({
        message: error
      })
    }

    // TODO parse Path For Meta items 
    res.status(201).send('success')
  } else {
    res.status(400).send({
      message: "Media already added."
    })
  }
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

  let outputPath = getMediaPath(req.body.outputPath)
  createThumb(req.body.timestamp, req.body.inputPath, outputPath, req.body.width)
    .then(thumbResult => {
      res.status(201).send(thumbResult)
    })
    .catch(e => {
      console.log(e)
      res.status(400).send(e)
    })
};

exports.createGrid = async (req, res) => {
  const userfiles = path.join(__dirname, '../../userfiles')
  const gridsPath = path.join(userfiles, "/media/grids/");
  if (!fs.existsSync(gridsPath)) fs.mkdirSync(gridsPath);

  if (!fs.existsSync(req.body.input)) {
    res.status(400).send({
      message: "The video does not exist."
    })
    return
  }

  class Grid {
    constructor(opts) {
      this.tmpDir = os.tmpdir()
      this.input = opts.input
      this.output = opts.output
      this.cols = opts.cols
      this.rows = opts.rows
      this.width = opts.width
      this.tileCount = this.rows * this.cols
    }

    getVideoDuration(pathToFile) {
      return new Promise((resolve, reject) => {
        return ffmpeg.ffprobe(pathToFile, (error, info) => {
          if (error) return reject(error)
          return resolve(info.format.duration)
        })
      })
    }

    makeLayout(i) {
      // see https://ffmpeg.org/ffmpeg-filters.html#xstack for the madness
      const currentColumn = i % this.cols
      const currentRow = Math.floor(i / this.cols)
      let colSide = []
      let rowSide = []
      if (currentColumn === 0) colSide.push('0')
      else
        for (var j = 0; j < currentColumn; j++) colSide.push('w0')
      if (currentRow === 0) rowSide.push('0')
      else
        for (var k = 0; k < currentRow; k++) rowSide.push('h0')
      return `${colSide.join('+')}_${rowSide.join('+')}`
    }

    async ffmpegSeekP(timestamp, intermediateOutput) {
      return new Promise((resolve, reject) => {
        ffmpeg()
          .addOption('-ss', timestamp)
          .addOption('-i', this.input)
          .addOption('-frames:v', '1')
          .save(intermediateOutput)
          .on('end', function () {
            setTimeout(() => {
              resolve(intermediateOutput)
            }, 500)
          })
          .on('error', function (e) {
            reject(e)
          })
      })
    }

    async ffmpegCombineP(inputFiles, streams, layouts) {
      return new Promise((resolve, reject) => {
        const command = ffmpeg()
        inputFiles.forEach((inputFile) => {
          command.input(inputFile)
        })
        command
          .addOption('-y')
          .addOption('-filter_complex', `${streams.join('')}xstack=inputs=${this.tileCount}:layout=${layouts.join('|')}[v];[v]scale=${Math.floor(this.width*this.cols)}:-1[scaled]`)
          .addOption('-map', '[scaled]')
          .save(path.join(gridsPath, this.output))
          .on('end', function () {
            resolve()
          })
          .on('error', function (e) {
            reject(e)
          })
      })
    }

    async generate() {
      const duration = await this.getVideoDuration(this.input)
      if (typeof duration !== 'number') return false
      const durSlice = parseInt(duration / this.tileCount)

      let framePromises = []
      for (var i = 0; i < this.tileCount; i++) {
        const timestamp = new Date(1000 * (i + 0.5) * durSlice).toISOString().substr(11, 8)
        const intermediateOutput = path.join(this.tmpDir, `thumb${i}.png`)
        framePromises.push(this.ffmpegSeekP(timestamp, intermediateOutput))
      }

      await Promise.all(framePromises)
        .catch(err => {
          // console.log(err)
        })

      // combine images together to make tile
      let inputFiles = []
      let streams = []
      let layouts = []
      for (var l = 0; l < this.tileCount; l++) {
        inputFiles.push(`${this.tmpDir}/thumb${l}.png`)
        streams.push(`[${l}:v]`)
        layouts.push(this.makeLayout(l))
      }
      await this.ffmpegCombineP(inputFiles, streams, layouts)
        .catch(err => {
          console.log(err)
        })

      return {
        output: this.output
      }
    }
  }

  const gridPath = path.join(gridsPath, req.body.output);
  if (!fs.existsSync(gridPath)) {
    const grid = new Grid(req.body)
    const result = await grid.generate()
    if (result) {
      res.status(201).send(result)
    } else {
      res.status(400).send({
        message: 'Grid already exists'
      });
    }
  } else {
    res.status(400).send({
      message: 'Grid already exists'
    });
  }
};

exports.createTimeline = async (req, res) => {
  const userfiles = path.join(__dirname, '../../userfiles')
  const timelinesPath = path.join(userfiles, "/media/timelines/");
  if (!fs.existsSync(timelinesPath)) fs.mkdirSync(timelinesPath);

  if (!fs.existsSync(req.body.path)) {
    res.status(400).send({
      message: "The video does not exist."
    })
    return
  }

  class Timeline {
    constructor(video) {
      this.video = video
    }

    getVideoDuration(pathToFile) {
      return new Promise((resolve, reject) => {
        return ffmpeg.ffprobe(pathToFile, (error, info) => {
          if (error) return reject(error)
          return resolve(info.format.duration)
        })
      })
    }

    createFrame(timestamp, output) {
      return new Promise((resolve, reject) => {
        ffmpeg()
          .addOption('-ss', timestamp)
          .addOption('-i', this.video.path)
          .addOption('-frames:v', '1')
          .addOption('-vf', `scale=-1:180`)
          .save(output)
          .on('end', () => {
            setTimeout(() => {
              resolve(output)
            }, 500)
          })
          .on('error', (e) => {
            reject(e)
          })
      })
    }

    async generate() {
      const parts = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95]
      const duration = await this.getVideoDuration(this.video.path)
      if (typeof duration !== 'number') return false
      const timestamps = parts.map(i => (new Date(Math.floor(duration * (i / 100) * 1000)).toISOString().substr(11, 8)))
      let framePromises = []

      for (let i = 0; i < timestamps.length; i++) {
        let output = path.join(timelinesPath, `${this.video.id}_${parts[i]}.jpg`)
        framePromises.push(this.createFrame(timestamps[i], output))
      }

      const result = await Promise.all(framePromises)
      return result
    }
  }

  const firstFrame = path.join(timelinesPath, req.body.id + "_5.jpg");
  if (!fs.existsSync(firstFrame)) {
    const timeline = new Timeline(req.body)
    const result = await timeline.generate()
    if (result) {
      res.status(201).send(result)
    } else {
      res.status(400).send({
        message: 'Timeline already exists'
      });
    }
  } else {
    res.status(400).send({
      message: 'Timeline already exists'
    });
  }
};


const {
  machineId
} = require('node-machine-id')

exports.getMachineId = async (req, res) => {
  machineId().then((id) => {
    res.status(201).send(id)
  })
};


const Jimp = require('jimp');

exports.createImage = (req, res) => {
  const outputPath = getMediaPath(req.body.outputPath)
  const buf = Buffer.from(req.body.image, 'base64');

  Jimp.read(buf)
    .then(image => {
      return image
        // .resize(sizes.width, sizes.height)
        .quality(85)
        .write(outputPath)
    }).then(image => {
      res.status(201).send(image)
    })
    .catch(e => {
      console.log(e)
      res.status(400).send(e)
    })
};

exports.deleteImage = (req, res) => {
  const filePath = getMediaPath(req.body.path)

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.status(201).send({
        message: 'successfully deleted local image'
      })
    }
  })
};