import { ipcRenderer } from 'electron'
ipcRenderer.send('test', 'ping')
ipcRenderer.on('test-reply', function (event, arg) {
    document.getElementById("ret").innerHTML = arg
})