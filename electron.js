const { BrowserWindow, app } = require('electron')
require('./server.js')

let mainWindow = null

function main() {
  mainWindow = new BrowserWindow()
  mainWindow.loadURL(`http://localhost:5555/`)
  mainWindow.on('close', () => {
    mainWindow = null
  })
}

app.on('ready', main)