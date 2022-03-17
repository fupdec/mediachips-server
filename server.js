const express = require('express')
const router = express.Router()
const jsonParser = express.json()
const path = require('path')
const fs = require('fs')
const history = require('connect-history-api-fallback')
const app = express()
const cors = require('cors')
const db = require("./api");
const {
  Umzug,
  SequelizeStorage
} = require('umzug');
const expressWs = require('express-ws')(app)
const chokidar = require("chokidar");

app.use(express.json({
  limit: '100mb'
}))
app.use(cors())
app.use(router)


// creating default config
const configPath = path.join(__dirname, 'dist/config.json')
let defaultConfig = {
  port: 5555
}
try {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), {
    flag: 'wx'
  })
} catch (e) {
  if (e.code == 'EEXIST') console.log('\x1b[33m%s\x1b[0m', 'Server configuration loaded')
  else console.log('\x1b[31m%s\x1b[0m', e)
}

// getting IP of localhost
const {
  networkInterfaces
} = require('os')
const nets = networkInterfaces()
let ip
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      ip = net.address
      break
    }
  }
}
let config = require(configPath)
config.ip = ip || 'localhost'

fs.writeFileSync(configPath, JSON.stringify(config, null, 2), (err) => {
  if (err) return console.log(err)
})


// Creating default folders
const userfiles = path.join(__dirname, 'userfiles')
const mediaPath = path.join(userfiles, 'media')
const marksPath = path.join(mediaPath, 'marks')
// const thumbsPath = path.join(mediaPath, 'thumbs')
// const metaPath = path.join(mediaPath, 'meta')
if (!fs.existsSync(userfiles)) fs.mkdirSync(userfiles)
if (!fs.existsSync(mediaPath)) fs.mkdirSync(mediaPath)
if (!fs.existsSync(marksPath)) fs.mkdirSync(marksPath)
// if (!fs.existsSync(thumbsPath)) fs.mkdirSync(thumbsPath)
// if (!fs.existsSync(metaPath)) fs.mkdirSync(metaPath)


// testing database connection
try {
  db.sequelize.authenticate()
  console.log('\x1b[36m%s\x1b[0m', 'Sequelize successfully connected')
} catch (e) {
  console.log('\x1b[31m%s\x1b[0m', 'Sequelize connection error: ', e)
}

// sequelize.sync({force: true}) // drop existing tables on start
db.sequelize.sync({
  // force: true
}).then(async () => {
  // migration system
  const umzug = new Umzug({
    migrations: {
      glob: 'api/migrations/*.js'
    },
    context: db.sequelize.getQueryInterface(),
    storage: new SequelizeStorage({
      sequelize: db.sequelize
    }),
    // logger: console,
  });

  await umzug.up();
})


// using vue's built as static files
const src = path.join(__dirname, 'dist')
const staticFileMiddleware = express.static(src)
app.use(staticFileMiddleware)
app.use(history({
  disableDotRule: true,
  verbose: true
}))
app.use(staticFileMiddleware)


// REST api
require("./api/routes/ChildMeta.routes")(app)
require("./api/routes/FilterRow.routes")(app)
require("./api/routes/FilterRowsInSavedFilter.routes")(app)
require("./api/routes/Item.routes")(app)
require("./api/routes/ItemsInFilterRow.routes")(app)
require("./api/routes/ItemsInItem.routes")(app)
require("./api/routes/ItemsInMedia.routes")(app)
require("./api/routes/Mark.routes")(app)
require("./api/routes/Media.routes")(app)
require("./api/routes/MediaType.routes")(app)
require("./api/routes/Meta.routes")(app)
require("./api/routes/MetaInMediaType.routes")(app)
require("./api/routes/MetaSetting.routes")(app)
require("./api/routes/PageSetting.routes")(app)
require("./api/routes/SavedFilter.routes")(app)
require("./api/routes/Setting.routes")(app)
require("./api/routes/Task.routes")(app)
require("./api/routes/ValuesInItem.routes")(app)
require("./api/routes/ValuesInMedia.routes")(app)
require("./api/routes/VideoMetadata.routes")(app)
require("./api/routes/WatchedFolder.routes")(app)

app.post('/api/get-file', jsonParser, (req, res) => {
  res.sendFile(req.body.url, {
    root: __dirname
  })
})
// Stream video
router.get('/api/video/:id', (req, res) => {
  db.Media.findOne({
    where: {
      id: req.params.id
    }
  }).then(video => {
    const videoPath = video.path
    if (!fs.existsSync(videoPath)) {
      res.status(404).send({
        message: "Video doesn't exists."
      })
      return
    }
    const videoStat = fs.statSync(videoPath)
    const fileSize = videoStat.size
    const videoRange = req.headers.range
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      const file = fs.createReadStream(videoPath, {
        start,
        end
      })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(videoPath).pipe(res)
    }
  }).catch(err => {
    res.status(500).send({
      message: err.message || "The video was not found in the database."
    })
  })
})


// file watcher
app.ws('/watcher', (ws, req) => {
  let watcher, watchedFolders, extensions, foldersData

  const getExt = (filePath) => {
    let ext = path.extname(filePath.toLowerCase())
    return ext.replace('.', '')
  }
  const getAllFiles = async (dirs) => {
    let files = []
    for (let d in dirs) { // get all paths from watched directories
      if (dirs[d].length == 0) continue
      for (let i = 0; i < dirs[d].length; i++) {
        let filePath = path.join(d, dirs[d][i])
        if (extensions.includes(getExt(filePath))) files.push(filePath)
      }
    }
    const videos = await db.Media.findAll({
      where: {
        typeId: 1
      },
      raw: true,
    })
    foldersData = []
    for (let fp of watchedFolders) {
      let filesInDb = videos.filter(x => x.path.includes(fp)).map(i => i.path)
      let filesInFolder = files.filter(x => x.includes(fp))
      let lostFiles = filesInDb.filter(x => !filesInFolder.includes(x))
      let newFiles = filesInFolder.filter(x => !filesInDb.includes(x))
      foldersData.push({
        folder: fp,
        lostFiles: lostFiles.sort((a, b) => a.localeCompare(b)),
        newFiles: newFiles.sort((a, b) => a.localeCompare(b))
      })
    }
    ws.send(JSON.stringify({
      type: 'files',
      data: foldersData,
    }))
  }

  const addFile = (filePath) => {
    if (!extensions.includes(getExt(filePath))) return
    for (let i of foldersData || [])
      if (i.newFiles.includes(filePath)) return // checking for duplicates
    getAllFiles(watcher.getWatched())
  }

  const removeFile = (filePath) => {
    if (!extensions.includes(getExt(filePath))) return
    for (let i of foldersData || [])
      if (i.lostFiles.includes(filePath)) return // checking for duplicates
    getAllFiles(watcher.getWatched())
  }

  const init = () => {
    watcher = chokidar.watch(watchedFolders, {
      ignoreInitial: true
    })
    watcher
      .on('add', path => addFile(path))
      .on('change', path => removeFile(path))
      .on('unlink', path => removeFile(path))
      .on('ready', () => {
        let watchedFilesList = watcher.getWatched()
        getAllFiles(watchedFilesList)
      })
  }

  ws.on('message', (msg) => {
    msg = JSON.parse(msg)
    switch (msg.type) {
      case 'init':
        extensions = msg.extensions
        watchedFolders = msg.data.map(i => i.path)
        watchedFolders = [...new Set(watchedFolders)]
        init()
        break;
      case 'update':
        watchedFolders = msg.data.map(i => i.path)
        watchedFolders = [...new Set(watchedFolders)]
        getAllFiles(watcher.getWatched())
        break;
      case 'stop':
        watcher.close().then(() => {
          ws.send(JSON.stringify({
            type: 'closed',
          }))
        })
        break;
    }
  });
  ws.on('close', () => {
    let msgc = {
      'message': 'closed'
    }
    watcher.close().then(() => ws.send(JSON.stringify(msgc)))
  })
});

// starting server
app.listen(config.port, () => {
  console.info('\x1b[7m%s\x1b[0m', `App started. Open in browser: http://${ip}:${config.port}`);
})

exports.config = config