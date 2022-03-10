/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */
const { contextBridge, ipcRenderer } = require("electron")

/* ----------------------------------------------------------------
  テスト関数
----------------------------------------------------------------- */
const sayAlrert = (result) => {
  window.alert(result)
}

/* ----------------------------------------------------------------
  各種処理
----------------------------------------------------------------- */
contextBridge.exposeInMainWorld("electron", {
  //isSupportedNotice: () => ipcRenderer.invoke("is-notification-supported").then(result => result).catch(err => console.log(err)),
  noSupportedNotice: () => false,
  notice: async () =>  {
    await ipcRenderer.invoke("require-send-notice")
      .then((result) => {
        //console.log(result)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  init: async () => {
    const result = await ipcRenderer.invoke('require-send-init')
    return result
  },
  saveConfig: async (configData) => {
    const result = await ipcRenderer.invoke('require-send-save-config', configData)
    return result
  },
  getConfig: async () => {
    const result = await ipcRenderer.invoke('require-send-get-config')
    return result
  },
  saveProject: async (projectData) => {
    const result = await ipcRenderer.invoke('require-send-save-project', projectData)
    return result
  },
  checkHtml: async (settings) => {
    //await ipcRenderer.invoke('require-send-set-serenium', settings.id)
    const result = await ipcRenderer.invoke('require-send-check-html', settings)
    return result
  },
  getUpdateFiles: async (sentData) => {
    const result = await ipcRenderer.invoke('require-send-get-update-files', sentData)
    return result
  },
  updateCacheFiles: async (sentData) => {
    const result = await ipcRenderer.invoke('require-send-cache-update', sentData)
    return result
  },
  directoryCheck: async (formData) => {
    const result = await ipcRenderer.invoke('require-send-directory-check', formData)
    return result
  }
});