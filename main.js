const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const os = require('os')
const server = require('./app/server.js')
const path = require('path')

let win = null

function createMainWindow() {
  win = new BrowserWindow({
    frame: os.type() !== 'Windows_NT',
    backgroundColor: '#333',
    icon: path.join(__dirname, 'dist/icons', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'electron/preload.js'),
      contextIsolation: true
    }
  })
  win.loadURL(`http://localhost:${server.config.port}/`)
  win.on('close', () => {
    win = null
  })
  win.on('maximize', () => {
    win.webContents.send('maximize')
  })
  win.on('unmaximize', () => {
    win.webContents.send('unmaximize')
  })
}

app.on('ready', createMainWindow)

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