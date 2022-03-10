/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */
const FileSystem = require('../common/file-system.js')
const SvnSystem = require('../common/svn-system.js')
const BacklogApi = require('../common/backlog/backlog-api.js')

/* ----------------------------------------------------------------
  キャシュ更新 クラス
----------------------------------------------------------------- */
module.exports = class CacheUpdate extends SvnSystem {
  constructor(sentData) {
    super()
    this.Fs = require('fs')
    this.glob = require('glob')
    this.path = require('path')

    this.writedFiles = {}
    this.updateFiles = {}

    this.pram = sentData.parameter
    this.dir = sentData.enviroment
    this.inputFrom = sentData.input
    this.backLogComment = sentData.backLogComment
  }

  /**
   * キャッシュを更新するリソースファイルを取得
   * @param {*} data
   * @returns
   */
  getCacheFiles(data) {
    const self = this

    return new Promise(resolve => {
      if (!data.target.entry) {
        resolve(null)
        return
      }

      const list = []
      const cacheFiles = []
      const entries = data.target.entry
      const dir = self.dir

      if(!entries.length) {
        const entry = entries
        const filepath = entry['$'].path
        let relativePath = filepath.replaceAll('\\', '/')
        relativePath = relativePath.replace(dir, '')
        const status = entry['wc-status']['$'].item
        const item = {
          path: relativePath,
          status: status
        }
        list.push(item)
      }

      for (let index = 0; index < entries.length; index++) {
        const entry = entries[index]
        const filepath = entry['$'].path
        let relativePath = filepath.replace(dir, '')
        relativePath =  '/' + relativePath.replaceAll('\\', '/')
        const status = entry['wc-status']['$'].item
        const item = {
          path: relativePath,
          status: status
        }
        list.push(item)
      }

      for (let indexl = 0; indexl < list.length; indexl++) {
        const item = list[indexl]

        const ext = self.path.extname(item.path)
        if (ext === '.html' || ext === '.inc' || ext === '.php') {
          continue
        }

        if (item.status === 'modified') {
          cacheFiles.push(item)
        }
      }
      resolve(cacheFiles)
    })
  }

  getCMS() {
    const self = this
    return new Promise(async (resolve) => {
      const BA = new BacklogApi(self.backLogComment)
      const backlogData = await BA.getMergeData()

      if (!backlogData) {
        resolve(null)
        return
      }

      const list = backlogData.fileList

      const result = {
        environment: self.dir,
        cacheFiles: []
      }

      for (let indexl = 0; indexl < list.length; indexl++) {
        const item = list[indexl]

        const ext = self.path.extname(item.path)
        if (ext === '.html' || ext === '.inc' || ext === '.php') {
          continue
        }

        if (item.status === 'update') {
          result.cacheFiles.push(item)
        }
      }
      resolve(result)
    })
  }

  getCacheFilesFromSVN () {
    const self = this
    return new Promise(async (resolve) => {
      /* SVNから更新した、コミット前のリソースファイルを取得 */
      const data = await self.getSVNStatus(self.dir)
      if (!data.target.entry) {
        resolve(null)
        return
      }

      /* キャッシュを更新するリソースファイルを取得 */
      const cacheFiles = await self.getCacheFiles(data)

      if (cacheFiles.length === 0 || !cacheFiles) {
        resolve(null)
        return
      }

      resolve(cacheFiles)
      return
    })
  }

  getCacheFilesFromBackLog () {
    const self = this
    return new Promise(async (resolve) => {
      /* バックログからキャッシュを更新するリソースファイルを取得 */
      const backlogData = await self.getCMS()

      if (!backlogData) {
        resolve(null)
        return
      }

      const cacheFiles = backlogData.cacheFiles
      self.dir = backlogData.environment

      if (cacheFiles.length === 0 || !cacheFiles) {
        resolve(null)
        return
      }

      resolve(cacheFiles)
      return
    })
  }

  /**
   * 開発環境配下にあるソースコードのファイルを全て取得
   * @returns
   */
  getAllSourceFile() {
    const dir = this.dir
    const patern = dir + '/**/*'
    const self = this

    console.log(`\ngrep directory : ${dir}`)
    console.log('Getting all source files now....')

    return new Promise(resolve => {
      self.glob(patern, { ignore: ['**/node_modules/**/*', '**/.git/**/*', '**/.svn/**/*', '**/_lab/**/*'] }, (err, files) => {
        resolve(files)
      })
    })
  }

  /**
   * キャッシュ更新をするリソースを読み込んでいる
   * ソースファイルの取得
   * @param {*} files
   * @param {*} cacheFiles
   * @returns
   */
  getWritedFiles(files, cacheFiles) {
    const self = this
    return new Promise(async (resolve) => {
      console.log(`\ncache files: ${cacheFiles.length} files`)
      console.log(`grep files: ${files.length}`)
      console.log('grep now.... ')

      for (let index = 0; index < cacheFiles.length; index++) {
        const cacheFile = cacheFiles[index]
        const resourcePath = cacheFile.path
        const newWritedFiles = await self.grepFile(resourcePath, files)
        console.log(newWritedFiles)
        self.writedFiles = Object.assign(self.writedFiles, newWritedFiles)
      }
      resolve(self.writedFiles)
    })
  }

  grepFile(resourcePath, files) {
    const self = this
    const writedFiles = self.writedFiles
    console.log(resourcePath)
    return new Promise(async (resolve) => {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const key = file.replace(self.dir, '')
        const extname = self.path.extname(file)
        switch (extname) {
          case '.css':
          case '.js':
          case '.ts':
          case '.jsx':
          case '.vue':
          case '.tsx':
          case '.sass':
          case '.scss':
          case '.inc':
          case '.html':
          case '.php':
          case '.html':
          case '.txt':
          case '.csv':
          case '.json':
          case '.jsonp':
            const data = self.Fs.readFileSync(file, 'utf-8')
            const match = data.match(resourcePath)
            if (match) {
              if (!writedFiles[key]) {
                const item = {
                  path: file,
                  resource: []
                }
                writedFiles[key] = item
                writedFiles[key].resource.push(resourcePath)
              } else {
                writedFiles[key].path = file
                writedFiles[key].resource.push(resourcePath)
              }
            }
            break
          default:
            break
        }
      }
      resolve(writedFiles)
    })
  }


  /**
   * ソースコードのキャッシュの記述を更新
   * @returns
   */
  doUpdateFile(updateFiles) {
    const self = this
    return new Promise(async (resolve) => {
      const updateFilesProperties = Object.keys(updateFiles)

      for (let index = 0; index < updateFilesProperties.length; index++) {
        const key = updateFilesProperties[index]
        const resourceData = updateFiles[key].resource
        if (updateFiles[key].checked === true) {
          self.changeParam(updateFiles[key].path, resourceData)
        }
      }

      // console.log('\nCache update completed.\n')
      resolve()
    })
  }

  changeParam(filePath, resourceData) {
    const self = this
    const FS = new FileSystem()
    let newData = null

    return new Promise(async (resolve) => {
      for (let index = 0; index < resourceData.length; index++) {
        const data = FS.readFile(filePath)
        const old_resourcePath = resourceData[index]
        const resourcePath = old_resourcePath.replaceAll('\-', '\\\-')

        const regExpVal = `(${resourcePath})([^${resourcePath}\\?\\d{8}])|(${resourcePath}\\?\\d{8}\")`
        const regExp = new RegExp(regExpVal, 'g')
        const newCache = `${resourcePath}?${self.pram}\"`
        newData = data.replaceAll(regExp, newCache)
        newData = newData.replaceAll(resourcePath, old_resourcePath)
        const reslut = FS.writeFile(filePath, newData)
      }
      resolve()
    })
  }


  /**
   * メイン処理関数
   * @returns
   */
  getUpDateFiles () {
    const result = {
      done: true,
      resourceFiles: null,
      updateFiles: null
    }
    const self = this
    return new Promise(async (resolve) => {


      if (self.inputFrom === 'svn') {
        /* SVNから更新した、コミット前のリソースファイルを取得 */
        result.resourceFiles = await self.getCacheFilesFromSVN()
      }

      if (self.inputFrom === 'backlog') {
        /* バックログからキャッシュを更新するリソースファイルを取得 */
        result.resourceFiles = await self.getCacheFilesFromBackLog()
      }

      if (result.resourceFiles === null) {
        // console.log('\nNo cache file.\n')
        resolve(result)
        return
      }

      /* 開発環境配下にあるソースコードのファイルを全て取得 */
      const files = await self.getAllSourceFile()

      /* キャッシュ更新をするリソースを読み込んでいるソースファイルの取得 */
      result.updateFiles = await self.getWritedFiles(files, result.resourceFiles)
      console.log(result.updateFiles)

      resolve(result)
      return
    })
  }
}
