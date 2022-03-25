const express = require('express')
const router = express.Router()
const jsonParser = express.json()
const path = require('path')
const fs = require('fs')
const history = require('connect-history-api-fallback')
const app = express()
const cors = require('cors')
const {
  Umzug,
  SequelizeStorage
} = require('umzug');
const expressWs = require('express-ws')(app)
const chokidar = require("chokidar");
const _ = require('lodash')

app.use(express.json({
  limit: '100mb'
}))
app.use(cors())
app.use(router)


// creating default config
const configPath = path.join(__dirname, 'dist/config.json')
let defaultConfig = {
  port: 5555,
  databases: []
}
defaultConfig.databases.push({
  id: Date.now().toString(16),
  name: 'Default',
  active: true,
  createdAt: Date.now(),
})
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


// creating default folders for databases
const databasesPath = path.join(__dirname, 'databases')
let userDirs = [databasesPath]
for (let i of config.databases) {
  const dbPath = path.join(databasesPath, i.id)
  const mediaPath = path.join(dbPath, 'media')
  const metaPath = path.join(dbPath, 'meta')
  const videoPath = path.join(mediaPath, 'videos')
  const imagePath = path.join(mediaPath, 'images')
  const audioPath = path.join(mediaPath, 'audios')
  const textPath = path.join(mediaPath, 'texts')
  let videoDirs = ['thumbs', 'marks', 'grids', 'timelines'].map(i => (
    path.join(videoPath, i)
  ))
  userDirs = [...userDirs, ...[dbPath, mediaPath, metaPath]]
  userDirs = [...userDirs, ...[videoPath, imagePath, audioPath, textPath]]
  userDirs = [...userDirs, ...videoDirs]
}
for (let i of userDirs) {
  if (!fs.existsSync(i))
    try {
      fs.mkdirSync(i)
    } catch (err) {
      console.log(err)
    }
}

const dbConfig = config.databases.find(i => i.active)

// creating connection for database
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  storage: path.join(databasesPath, dbConfig.id, 'db.sqlite'),
  dialect: 'sqlite',
  dialectOptions: {
    multipleStatements: true
  }
})
const db = require("./api")(sequelize);
db.config = dbConfig

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
  const migrationsPath = path.join(__dirname, 'api/migrations/*.js')
  const umzug = new Umzug({
    migrations: {
      glob: migrationsPath
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
require("./api/routes/ChildMeta.routes")(app, db)
require("./api/routes/FilterRow.routes")(app, db)
require("./api/routes/FilterRowsInSavedFilter.routes")(app, db)
require("./api/routes/Item.routes")(app, db)
require("./api/routes/ItemsInFilterRow.routes")(app, db)
require("./api/routes/ItemsInItem.routes")(app, db)
require("./api/routes/ItemsInMedia.routes")(app, db)
require("./api/routes/Mark.routes")(app, db)
require("./api/routes/Media.routes")(app, db)
require("./api/routes/MediaType.routes")(app, db)
require("./api/routes/Meta.routes")(app, db)
require("./api/routes/MetaInMediaType.routes")(app, db)
require("./api/routes/MediaTypesInWatchedFolders.routes")(app, db)
require("./api/routes/MetaSetting.routes")(app, db)
require("./api/routes/PageSetting.routes")(app, db)
require("./api/routes/SavedFilter.routes")(app, db)
require("./api/routes/Setting.routes")(app, db)
require("./api/routes/Task.routes")(app, db)
require("./api/routes/ValuesInItem.routes")(app, db)
require("./api/routes/ValuesInMedia.routes")(app, db)
require("./api/routes/VideoMetadata.routes")(app, db)
require("./api/routes/WatchedFolder.routes")(app, db)

app.post('/api/get-file', jsonParser, (req, res) => {
  if (req.body.outside) res.sendFile(req.body.url)
  else
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
  let watcher, watchedFolders, foldersMasked, filesList

  const getFilesList = async (dirs) => {
    let watchedFiles = []

    for (let d in dirs) { // get all paths from watched directories
      if (dirs[d].length == 0) continue
      for (let i = 0; i < dirs[d].length; i++)
        watchedFiles.push(path.join(d, dirs[d][i]))
    }

    filesList = []
    for (let i of watchedFolders) {
      const types = i.types
      const fp = i.path
      let filesByType = []
      for (let t of types) {
        const media = await db.Media.findAll({
          where: {
            typeId: t.id
          },
          raw: true,
        })

        let exts = t.extensions.replaceAll(',', '|')
        let regex = new RegExp('^.*\.(' + exts + ')$', "gm")
        let filesInFolder = _.cloneDeep(watchedFiles)
        filesInFolder = filesInFolder.filter(x =>
          regex.test(x.toLowerCase()) && x.includes(fp)
        )
        let filesInDb = media.filter(x => x.path.includes(fp)).map(i => i.path)
        let lostFiles = filesInDb.filter(x => !filesInFolder.includes(x))
        let newFiles = filesInFolder.filter(x => !filesInDb.includes(x))
        filesByType.push({
          type: t,
          lost: lostFiles.sort((a, b) => a.localeCompare(b)),
          new: newFiles.sort((a, b) => a.localeCompare(b))
        })
      }
      filesList.push({
        folder: i,
        files: filesByType,
      })
    }
    ws.send(JSON.stringify({
      type: 'files',
      data: filesList,
    }))
  }

  const addFile = (filePath) => {
    for (let i of filesList || [])
      if (i.newFiles.includes(filePath)) return // checking for duplicates
    getFilesList(watcher.getWatched())
  }

  const removeFile = (filePath) => {
    for (let i of filesList || [])
      if (i.lostFiles.includes(filePath)) return // checking for duplicates
    getFilesList(watcher.getWatched())
  }

  const startWatcher = () => {
    watcher = chokidar.watch(foldersMasked, {
      ignoreInitial: true
    })
    watcher
      .on('add', path => addFile(path))
      .on('change', path => removeFile(path))
      .on('unlink', path => removeFile(path))
      .on('ready', () => {
        getFilesList(watcher.getWatched())
      })
  }

  const getFoldersMasked = (folders) => {
    foldersMasked = []
    for (let folder in folders) {
      for (let ext of folders[folder]) {
        foldersMasked.push(path.join(folder, '**', `*.${ext}`))
      }
    }
  }

  ws.on('message', (msg) => {
    msg = JSON.parse(msg)
    switch (msg.type) {
      case 'start':
        watchedFolders = msg.folders
        getFoldersMasked(msg.extensions)
        startWatcher()
        break;
      case 'update':
        watchedFolders = msg.folders
        getFoldersMasked(msg.extensions)
        watcher.add(foldersMasked)
        getFilesList(watcher.getWatched())
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