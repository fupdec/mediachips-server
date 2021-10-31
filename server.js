const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const app = express()
const cors = require('cors')
const { Sequelize, DataTypes } = require('sequelize')

app.use(cors())

const sequelize = new Sequelize({ dialect: 'sqlite', storage: 'db.sqlite' })
try {
  sequelize.authenticate()
  console.log('DB connected')
} catch (e) {
  console.log('DB connection error: ', e)
}

const Video = sequelize.define(
  'Video', {
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
    },
  }
)
sequelize.sync()

// using vue's built as static files
const src = path.join(__dirname, 'dist') 
const staticFileMiddleware = express.static(src)
app.use(staticFileMiddleware)
app.use(history({ disableDotRule: true, verbose: true }))
app.use(staticFileMiddleware)

// creating logs
// app.use(function(request, response, next){
//   let now = new Date()
//   let hour = now.getHours()
//   let minutes = now.getMinutes()
//   let seconds = now.getSeconds()
//   let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`
//   console.log(data)
//   fs.appendFile("server.log", data + "\n", function(){})
//   next()
// })

// REST api
app.get('/api/db', async (req, res) => {
  const allVideos = await Video.findAll()
  res.status(201).send(allVideos)
})
app.post('/api/db', async (req, res) => {
  await Video.create({ path: 'defpath' })
  res.status(201).send({message: "Added new video"})
})

// starting server
const port = 5555
app.listen(port, () => {
  console.info(`App started. Open in browser: http://localhost:${port}`);
})