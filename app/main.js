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

const SeleniumChromeDirver = require('./main-process/common/selenium-chrome-dirver.js')
const WebScrapingModule = require('./main-process/common/web-scraping.js')

const W3cApi = require('./main-process/check-page/w3c-api.js')
const ALtChecker = require('./main-process/check-page/alt-check.js')
const OnClickChecker = require('./main-process/check-page/onclick-checker.js')

const CacheUpdate = require('./main-process/cache-update/cache-updata.js')


/* ----------------------------------------------------------------
  electron
----------------------------------------------------------------- */
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

/* メインプロセスとレンダラープロセスのipc通信 */
const ipcMain = electron .ipcMain

/* ----------------------------------------------------------------
  electron 各処理
----------------------------------------------------------------- */
let mainWindow

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if(process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1500,
    heigth: 900,
    icon: __dirname + '/resources/img/icon.ico',
    webPreferences: {
      nodeIntegration: false, // XSS対策としてnodeモジュールを使わないように設定
      contextIsolation: true, // 限定的にAPIを公開する設定
      preload: path.resolve("app/preload.js"), // レンダラープロセスに公開するAPIのファイル
    }
  })
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', function () {
    closeBrowze()
    mainWindow = null
  })
}

/* ----------------------------------------------------------------
  ipC処理
----------------------------------------------------------------- */
let SCD = null
/*
--------------------------------------------------
初期化
--------------------------------------------------
*/
ipcMain.handle('require-send-init', async (event) => {
  let configData = await JS.getConfig()
  console.log('configData   :', configData)
  const keys = Object.keys(configData)
  console.log('keys', keys)
  console.log('keys', keys.length)
  if (keys.length === 0) {
    console.log('no configData')
    configData = {
      "svn": {
        "username": "",
        "password": ""
      },
      "vm": ""
    }
    const initConfig = {
      "config": {
        "svn": {
          "username": "",
          "password": ""
        },
        "vm": ""
      }
    }

    await JS.saveConfig(configData)
    closeBrowze()
    await setSelenuium()
    await setBrowze(configData.project)
    return initConfig
  }

  closeBrowze()
  await setSelenuium()
  await setBrowze(configData.project)

  return configData
})

/*
--------------------------------------------------
コンフィギュレーション
--------------------------------------------------
*/
/**
 * コンフィギュレーションファイルに保存
 */
ipcMain.handle('require-send-save-config', async (event, configData) => {
  console.log('\nsaveing\n')
  const result = await JS.saveConfig(configData)
  return result
})

/**
 * コンフィギュレーションファイルから設定情報を取得
 */
ipcMain.handle('require-send-get-config', async (event) => {
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
})

/**
 * プロジェクト設定をコンフィギュレーションファイルに保存
 */
ipcMain.handle('require-send-save-project', async (event, projectData) => {
  const result = await JS.saveProjectData(projectData)
  await setBrowze(projectData)
  return result
})

/*
--------------------------------------------------
セレニウム
--------------------------------------------------
*/

const setSelenuium = () => {
  console.log('setSelenuium')
  return new Promise( async(resolve) => {
    if (!SCD) {
      SCD = new SeleniumChromeDirver()
    }
    SCD.pc.driver = await SCD.createDriver('pc')
    SCD.sp.driver = await SCD.createDriver('sp')
    resolve()
  })
}

const setBrowze = (projects) => {
  console.log('setBrowze')
  console.log('projects', projects)
  return new Promise( async(resolve) => {
    if (projects) {
      for (let index = 0; index < projects.length; index++) {
        const project = projects[index]
        if (!SCD.pc.winsowList[project.id]) {
          SCD.pc.winsowList[project.id] = await SCD.createNewWindowHandle('pc', project.settings.pageData.url)
        }
        if (!SCD.sp.winsowList[project.id]) {
          SCD.sp.winsowList[project.id] = await SCD.createNewWindowHandle('sp', project.settings.pageData.url)
        }
      }
    }
    resolve()
  })
}

const closeBrowze = () => {
  if (!SCD) {
    return
  }

  if (SCD.pc.driver) {
    SCD.pc.driver.quit()
  }

  if (SCD.sp.driver) {
    SCD.sp.driver.quit()
  }
}
/*
--------------------------------------------------
HTMLチェック
--------------------------------------------------
*/
/**
 * 動的・静的HTML取得
 * @param {*} settings
 * @returns
 */
const getHTML = (settings) => {
  console.log(settings)
  return new Promise(async (resolve) => {
    const htmlData = {
      Single: null,
      PC: null,
      SP: null
    }
    if (settings.pageSource === '') {
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

/**
 * HTMLチェック
 */
ipcMain.handle('require-send-check-html', async (event, settings) => {
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
})

/*
--------------------------------------------------
ファイル操作
--------------------------------------------------
*/
/**
 * ファイ・ディレクトリ確認
 */
ipcMain.handle('require-send-directory-check', async (event, environment) => {
  return FS.checkFile(environment)
})

/*
--------------------------------------------------
キャッシュ対策更新
--------------------------------------------------
*/
let CU = null

/**
 * キャッシュ対策を更新するファイルの取得
 */
ipcMain.handle('require-send-get-update-files', async (event, sentData) => {
  console.log('\nGet update files.')
  CU = new CacheUpdate(sentData)
  let result = await CU.getUpDateFiles()
  console.log('\nComp Getiing update files.')
  return result
})

/**
 * キャッシュ対策更新
 */
ipcMain.handle('require-send-cache-update', async (event, sentData) => {
  console.log('\nCache update Start.')
  const result = null
  await CU.doUpdateFile(sentData)
  console.log('\nComp update files.')
  return result
})
