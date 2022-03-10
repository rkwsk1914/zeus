/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */
const path = require('path')
const url = require('url')

/* ----------------------------------------------------------------
  サーバーサイド プロセス
----------------------------------------------------------------- */
const JsonStorage = require('./main-process/save-json.js')
const JS = new JsonStorage()

const FileSystem = require('./main-process/common/file-system.js')
const FS = new FileSystem()

const WatchFile = require('./main-process/common/watch-file.js')
const WF = new WatchFile()

const SeleniumChromeDirver = require('./main-process/common/selenium-chrome-dirver.js')
const WebScrapingModule = require('./main-process/common/web-scraping.js')

const W3cApi = require('./main-process/check-page/w3c-api.js')
const ALtChecker = require('./main-process/check-page/alt-check.js')
const OnClickChecker = require('./main-process/check-page/onclick-checker.js')

const CacheUpdate = require('./main-process/cache-update/cache-updata.js')
//const ReportCreater = require('./main-process/report-creater.js')

/* ----------------------------------------------------------------
  セレニウム グローバル変数
----------------------------------------------------------------- */
const ListSerinium = {}

const configData = {
  "config": {
    "svn": {
      "username": "ssss",
      "password": "assdas"
    },
    "vm": "C:/previewBox/m2-dev.local/"
  },
  "project": [
    {
      "id": 1,
      "settings": {
        "id": 1,
        "title": "Project1",
        "backlog": "",
        "pageData": {
          "url": "https://www.softbank.jp/mobile/",
          "username": "",
          "password": ""
        },
        "pageSource": "",
        "environmentPath": "",
        "environment": "wiro-br"
      }
    },
    {
      "id": 2,
      "settings": {
        "id": 2,
        "title": "Project1",
        "backlog": "",
        "pageData": {
          "url": "https://www.softbank.jp/mobile/service",
          "username": "",
          "password": ""
        },
        "pageSource": "",
        "environmentPath": "",
        "environment": "wiro-br"
      }
    }
  ]
}

/* ----------------------------------------------------------------
  ipC処理
----------------------------------------------------------------- */
/**
 * コンフィギュレーションファイルに保存
 */
const requireSendSaveConfig = async (event, configData) => {
  console.log('\nsaveing\n')
  const result = await JS.saveConfig(configData)
  return result
}

/**
 * コンフィギュレーションファイルから設定情報を取得
 */
const requireSendGetConfig = async (event) => {
  const result = await JS.getConfig()
  if (!result) {
    const initConfig = {
      "config": {
        "svn": {
          "username": "",
          "password": ""
        },
        "vm": ""
      }
    }
    await JS.saveConfig(initConfig)
    return initConfig
  }
  return result
}

const requireSendSetSerenium = (configData) => {
  return new Promise(async (resolve) => {
    const projects = configData.project
    if (projects) {
      for (let index = 0; index < projects.length; index++) {
        const project = projects[index]
        if (!ListSerinium[project.id]) {
          ListSerinium[project.id] = new SeleniumChromeDirver()
          ListSerinium[project.id].pcDirver = await ListSerinium[project.id].createDriver('pc')
          ListSerinium[project.id].spDirver = await ListSerinium[project.id].createDriver('sp')
        }
      }
    }
    console.log('ListSerinium', ListSerinium)
    resolve()
  })
}

/**
 * プロジェクト設定をコンフィギュレーションファイルに保存
 */
const requireSendSaveProject = async (projectData) => {
  const result = await JS.saveProjectData(projectData)
  return result
}

/**
 * 動的・静的HTML取得
 * @param {*} settings
 * @returns
 */
const getHTML = (settings) => {
  //console.log(settings)
  return new Promise(async (resolve) => {
    const htmlData = {
      Single: null,
      PC: null,
      SP: null
    }
    if (settings.pageSource === '') {
      const SCD = ListSerinium[settings.id]
      SCD.settings = settings
      htmlData.PC = await SCD.getHTMLData('pc')
      htmlData.PC = await SCD.checkGetHTMLError(htmlData.PC, 'pc')
      htmlData.SP = await SCD.getHTMLData('sp')
      htmlData.SP = await SCD.checkGetHTMLError(htmlData.SP, 'sp')
      if (!htmlData.PC && !htmlData.SP) {
        resolve(null)
        return
      }
      resolve(htmlData)
      return
    }

    const WS = new WebScrapingModule(settings)
    htmlData.Single = await WS.checkGetHTMLError(settings.pageSource)
    if (!htmlData.Single) {
      resolve(null)
      return
    }
    resolve(htmlData)
    return
  })
}

/* HTMLチェック */
const requireSendCheckHtml = async (settings) => {
  console.log('\nPage Check Start.')
  const result = {
    htmlValidation: {
      Single: null,
      PC: null,
      SP: null
    },
    altCheck: {
      Single: null,
      PC: null,
      SP: null
    },
    wtrCtrCheck: {
      Single: null,
      PC: null,
      SP: null
    }
  }
  const htmlData = await getHTML(settings)
  if (!htmlData) {
    return result
  }

  console.log('\nHTML OK\n')

  const W3C = new W3cApi()
  const AC = new ALtChecker()
  const OC = new OnClickChecker()

  if (settings.pageSource === '') {
    result.htmlValidation.PC = await W3C.doFetch(htmlData.PC)
    result.htmlValidation.SP = await W3C.doFetch(htmlData.SP)
    result.altCheck.PC = await AC.checkAlt(htmlData.PC)
    result.altCheck.SP = await AC.checkAlt(htmlData.SP)
    result.wtrCtrCheck.PC = await OC.doing(htmlData.PC)
    result.wtrCtrCheck.SP = await OC.doing(htmlData.SP)
    console.log('Page Check OK')
    return result
  }
  result.htmlValidation.Single = await W3C.doFetch(htmlData.Single)
  result.altCheck.Single = await AC.checkAlt(htmlData.Single)
  result.wtrCtrCheck.Single = await OC.doing(htmlData.Single)

  console.log('Page Check OK')
  return result
}

/**
 * ファイル。ディレクトリ確認
 */
const requireSendDirectoryCheck = async (environment) => {
  return FS.checkFile(environment)
}

/**
 * キャッシュ対策更新
 */
let CU = null

/* キャッシュ対策を更新するファイルの取得 */
const requireSendGetUpdateFiles = async (event, sentData) => {
  console.log('\nGet update files.')
  CU = new CacheUpdate(sentData)
  let result = await CU.getUpDateFiles()
  console.log('\nComp Getiing update files.')
  return result
}

/* キャッシュ対策更新 */
const requireSendCacheUpdate = async (event, sentData) => {
  console.log('\nCache update Start.')
  const result = null
  await CU.doUpdateFile(sentData)
  console.log('\nComp update files.')
  return result
}

/* ----------------------------------------------------------------
test関数
----------------------------------------------------------------- */
const testMain = async (configData) => {
  //await WF.readytoWathc()
  //await WF.doWatch()
  //await WF.stopWatch()
  const SCD = new SeleniumChromeDirver()
  await SCD.test()
}

testMain(configData)