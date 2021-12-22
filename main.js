const {
  BrowserWindow,
  Menu,
  app
} = require('electron')
const server = require('./server.js')
const path = require('path')

let mainWindow = null

function main() {
  mainWindow = new BrowserWindow({
    backgroundColor: '#333',
    icon: path.join(__dirname, 'dist/icons', 'icon.png'),
  })
  mainWindow.loadURL(`http://localhost:${server.config.port}/`)
  mainWindow.on('close', () => {
    mainWindow = null
  })
}

app.on('ready', main)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// let systemMenu = Menu.buildFromTemplate([])

// Menu.setApplicationMenu(systemMenu)