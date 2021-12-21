const express = require('express')
const router = express.Router()
const jsonParser = express.json()
const path = require('path')
const fs = require('fs')
const history = require('connect-history-api-fallback')
const app = express()
const cors = require('cors')
const db = require("./api");

app.use(express.json({
  limit: '100mb'
}))
app.use(cors())
app.use(router)

// testing database connection
try {
  db.sequelize.authenticate()
  console.log('\x1b[36m%s\x1b[0m', 'Sequelize successfully connected')
} catch (e) {
  console.log('\x1b[31m%s\x1b[0m', 'Sequelize connection error: ', e)
}

// sequelize.sync({force: true}) // drop existing tables on start
const settings = require('./default-settings.json')
db.sequelize.sync().then(async () => {
  // create media type: videos
  await db.MediaTypes.findOrCreate({
    where: {
      name: 'Video',
    },
    defaults: {
      icon: 'video-outline',
      extensions: '.mp4'
    }
  })
  await db.Settings.bulkCreate(settings.default, {
    ignoreDuplicates: true
  })
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
require("./api/routes/Functions.routes")(app)
require("./api/routes/Items.routes")(app)
require("./api/routes/ItemsInItems.routes")(app)
require("./api/routes/ItemsInMedia.routes")(app)
require("./api/routes/Markers.routes")(app)
require("./api/routes/Media.routes")(app)
require("./api/routes/MediaTypes.routes")(app)
require("./api/routes/Meta.routes")(app)
require("./api/routes/MetaInMediaTypes.routes")(app)
require("./api/routes/MetaSettings.routes")(app)
require("./api/routes/ValuesInItems.routes")(app)
require("./api/routes/ValuesInMedia.routes")(app)

app.post('/api/get-file', jsonParser, (req, res) => {
  res.sendFile(req.body.url, {
    root: __dirname
  })
})
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


// creating default config
const configPath = './config.json'
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
const results = Object.create(null)
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      if (!results[name]) results[name] = []
      results[name].push(net.address)
    }
  }
}
const ip = results.Ethernet ? results.Ethernet[0] : '192.168.0.1'
let config = require(configPath)
config.ip = ip

fs.writeFileSync(configPath, JSON.stringify(config, null, 2), function writeJSON(err) {
  if (err) return console.log(err)
})

// Creating default folders
const userfiles = path.join(__dirname, 'userfiles')
const mediaPath = path.join(userfiles, 'media')
const markersPath = path.join(mediaPath, 'markers')
const thumbsPath = path.join(mediaPath, 'thumbs')
const metaPath = path.join(mediaPath, 'meta')
if (!fs.existsSync(mediaPath)) fs.mkdirSync(mediaPath)
if (!fs.existsSync(markersPath)) fs.mkdirSync(markersPath)
if (!fs.existsSync(thumbsPath)) fs.mkdirSync(thumbsPath)
if (!fs.existsSync(metaPath)) fs.mkdirSync(metaPath)


// starting server
app.listen(config.port, () => {
  console.info('\x1b[7m%s\x1b[0m', `App started. Open in browser: http://${ip}:${config.port}`);
})