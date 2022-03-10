/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */
const Store = require('electron-store')

/* ----------------------------------------------------------------
  electron-store クラス
----------------------------------------------------------------- */
module.exports = class JsonStorage {
  constructor () {
    this.store = new Store({
      name: 'config',               // ファイル名
      fileExtension: 'json'         // 拡張子
    })
  }

  saveConfig (configData) {
    const store = this.store
    return new Promise( async(resolve) => {
      store.set('config', configData)
      const newData = store.get('config')
      resolve(newData)
    })
  }

  saveProjectData (project) {
    const store = this.store
    return new Promise( async(resolve) => {
      store.set('project', project)
      const newData = store.get()
      resolve(newData)
    })
  }

  getConfig () {
    const store = this.store
    return new Promise( async(resolve) => {
      const data = store.get()
      if (!data) {
        const initConfig = {
          "config": {
            "svn": {
              "username": "",
              "password": ""
            },
            "vm": ""
          }
        }
        store.set('config', initConfig)
        resolve(initConfig)
        return
      }
      resolve(data)
      return
    })
  }
}