const { BrowserWindow, app } = require('electron')
require('./server.js')
const config = require('./config.json')

let mainWindow = null
function main() {
  mainWindow = new BrowserWindow()
  mainWindow.loadURL(`http://localhost:${config.port}/`)
  mainWindow.on('close', () => {
    mainWindow = null
  })
}

app.on('ready', main)