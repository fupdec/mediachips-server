const {
	contextBridge,
	ipcRenderer
} = require('electron')
const os = require('os')

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
contextBridge.exposeInMainWorld('ipc', {
	on: (channel, func) => {
		ipcRenderer.on(channel, (...args) => func(...args));
	},
})
contextBridge.exposeInMainWorld('os', os)