const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const app = express()
// const fs = require("fs")
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db.sqlite')
const { Sequelize } = require('sequelize')

let create = 'CREATE TABLE IF NOT EXISTS contacts  (userId INTEGER AUTO_INCREMENT PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL UNIQUE);'
db.run(create)

const sequelize = new Sequelize({ dialect: 'sqlite', storage: 'db.sqlite' })
try {
  sequelize.authenticate()
  console.log('DB connected')
} catch (e) {
  console.log('DB connection error: ', e)
}

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
app.get('/api/db', (req, res) => {
  let contacts = 'SELECT * FROM contacts'
  res.status(201).send({message: db.run(contacts)});
})
app.post('/api/db', (req, res) => {
  let insert = 'INSERT INTO contacts (firstName, lastName, email, phone) VALUES( Lolik,	Bolik, as@ca.com, 214124124);'
  db.run(insert)
  res.status(201).send({message: "Added new contact"})
})

// starting server
const port = 5555
app.listen(port, () => {
  console.info(`App started. Open in browser: http://localhost:${port}`);
})