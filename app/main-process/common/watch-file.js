/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */
const chokidar = require("chokidar")

/* ----------------------------------------------------------------
  ファイル監視
----------------------------------------------------------------- */
module.exports = class WatchFile {
  constructor() {
    this.dir = []
    //chokidarの初期化
    this.watcher = chokidar.watch(this.dir, {
      ignored: /node_modules/,
      persistent: true
    })
  }

  readytoWathc() {
    const self = this
    return new Promise( (resolve) => {
      self.watcher.on('ready', () => {
        console.log('Initial scan complete. Ready for changes')
        resolve('ready complete')
      })
    })
  }

  doWatch() {
    const self = this
    return new Promise( (resolve) => {

      self.watcher
        .on('addDir', path => console.log(`Directory ${path} has been added`))
        //.on('unlinkDir', path => console.log(`Directory ${path} has been removed`))
        .on('error', error => console.log(`Watcher error: ${error}`))
        .on('ready', () => console.log('Initial scan complete. Ready for changes'))
        //.on('raw', (event, path, details) => { // internal
        //  console.log('Raw event info:', event, path, details)
        //})

      self.watcher
        //.on('add', path => console.log(`File ${path} has been added`))
        .on('change', path => console.log(`File ${path} has been changed`))
        //.on('unlink', path => console.log(`File ${path} has been removed`))

      resolve()
    })
  }

  stopWatch () {
    const self = this
    return new Promise( (resolve) => {
      self.watcher.close().then(() => {
        console.log('closed')
        resolve()
      })
    })
  }

}
