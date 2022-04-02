const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const server = require('./app/server.js')
const path = require('path')

let win = null

function main() {
  win = new BrowserWindow({
    backgroundColor: '#333',
    icon: path.join(__dirname, 'dist/icons', 'icon.png'),
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      contextIsolation: false
    }
  })
  win.loadURL(`http://localhost:${server.config.port}/`)
  win.on('close', () => {
    win = null
  })
}

app.on('ready', main)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// window events from render process
ipcMain.on('closeApp', () => {
  win.close()
})
ipcMain.handle('maximize', () => {
  win.maximize()
})
ipcMain.handle('unmaximize', () => {
  win.unmaximize()
})
ipcMain.handle('minimize', () => {
  win.minimize()
})