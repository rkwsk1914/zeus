/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */
const webdriver = require('selenium-webdriver')
const { Builder, By, until } = webdriver
//const {Preferences, Type, Level} = require('selenium-webdriver/lib/logging');

/* ----------------------------------------------------------------
  セレニウム クラス
----------------------------------------------------------------- */
module.exports = class SeleniumChromeDirver {
  constructor() {
    this.settings = null
    this.capabilities = null
    this.pc = {
      driver: null,
      winsowList: {}
    }
    this.sp = {
      driver: null,
      winsowList: {}
    }
  }

  async test () {
    const driver = await this.createDriver('pc')
    //await driver.get('https://www.softbank.jp/mobile/')
    //const htmlSorceData = await driver.getTitle()
    //console.log('title')
    //console.log(htmlSorceData)
    /*
    const errors = await driver.manage().logs().get(Type.BROWSER)
    for(var i=0; i < errors.length; i++) {
      console.log('no.', i)
      console.log(errors[i].message);
    }
    */
    //driver.quit()
  }

  setChromeCapabilities (pageType) {
      const capabilities = webdriver.Capabilities.chrome()
      let argsConfig = null

      switch (pageType) {
        case 'sp':
        case 'mb':
        case 'SP':
        case 'MB':
          argsConfig = [
            "--headless",
            "--disable-extensions",
            "--window-size=320,768",
            "--no-sandbox", // required for Linux without GUI
            "--disable-gpu", // required for Windows,
            "--enable-logging --v=1", // write debug logs to file(debug.log),
            '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.0 Mobile/14C92 Safari/602.1'
          ]
          break
        default:
          console.log(`undefind page type. Set type 'pc'.`)
        case 'pc':
        case 'PC':
        case '':
          argsConfig = [
            "--headless",
            "--disable-extensions",
            "--window-size=1400,768",
            "--no-sandbox", // required for Linux without GUI
            "--disable-gpu", // required for Windows,
            "--enable-logging --v=1", // write debug logs to file(debug.log),
          ]
          break
      }

      capabilities.set('chromeOptions', {
        args: argsConfig,
        w3c: false,
      })

      return capabilities
  }

  async getHTMLDataWithAuth(pageType) {
    console.log('\nThis is the permission page.')
    const username = this.settings.pageData.username
    const password = this.settings.pageData.password
    const url = this.settings.pageData.url.replace('https://', `https://${username}:${password}@`)
    const id = this.settings.id
    let browze
    switch (pageType) {
      case 'sp':
      case 'mb':
      case 'SP':
      case 'MB':
        browze = this.sp
        break
      case 'pc':
      case 'PC':
      case '':
      default:
        browze = this.pc
        break
    }

    const driver = browze.driver
    const windowHadle = browze.winsowList[id]

    return new Promise( async(resolve) => {
      await driver.switchTo().window(windowHadle)
      await driver.get(url)
      const htmlSorceData = await driver.getPageSource()

      const htmldata = '<!DOCTYPE html>' + htmlSorceData
      resolve(htmldata)
    })
  }

  async getHTMLData(pageType) {
    const url = this.settings.pageData.url
    const id = this.settings.id
    let browze
    switch (pageType) {
      case 'sp':
      case 'mb':
      case 'SP':
      case 'MB':
        browze = this.sp
        break
      case 'pc':
      case 'PC':
      case '':
      default:
        browze = this.pc
        break
    }

    const driver = browze.driver
    const windowHadle = browze.winsowList[id]

    return new Promise( async (resolve) => {
      await driver.switchTo().window(windowHadle)
      await driver.get(url)
      const htmlSorceData = await driver.getPageSource()

      const htmldata = '<!DOCTYPE html>' + htmlSorceData
      resolve(htmldata)
    })
  }

  checkGetHTMLError(htmlData, pageType) {
    const self = this
    return new Promise(async (resolve) => {
      if (!htmlData) {
        resolve(null)
        return
      }
      const is404 = htmlData.match(/404 Not Found/)
      if (is404) {
        console.log('This page 404 error.')
        resolve(htmlData)
        return
      }
      const is401 = htmlData.match(/401 Unauthorized/)
      if (is401) {
        let newHtmlData = await self.getHTMLDataWithAuth(pageType)
        newHtmlData = await self.checkGetHTMLErrorAgain(newHtmlData)
        resolve(newHtmlData)
        return
      }
      resolve(htmlData)
    })
  }

  checkGetHTMLErrorAgain(htmlData, pageType) {
    const self = this
    return new Promise(async (resolve) => {
      if (!htmlData) {
        resolve(null)
        return
      }
      const is404 = htmlData.match(/404 Not Found/)
      if (is404) {
        console.log('This page 404 error.')
        resolve(htmlData)
        return
      }
      const is401 = htmlData.match(/401 Unauthorized/)
      if (is401) {
        let newHtmlData = await self.getHTMLDataWithAuth(pageType)
        resolve(newHtmlData)
        return
      }
      resolve(htmlData)
    })
  }

  createDriver (type) {
    console.log()
    return new Promise(async (resolve) => {
      const capabilities = this.setChromeCapabilities(type)

      const driver = await new Builder().withCapabilities(capabilities).build()

      resolve(driver)
    })
  }

  createNewWindowHandle(pageType, url) {
    let driver
    switch (pageType) {
      case 'sp':
      case 'mb':
      case 'SP':
      case 'MB':
        driver = this.sp.driver
        break
      case 'pc':
      case 'PC':
      case '':
      default:
        driver = this.pc.driver
        break
    }

    return new Promise(async (resolve) => {
      const windowHadleList = await driver.getAllWindowHandles()
      const lastWndow = windowHadleList.length - 1
      const newWindowHandle = windowHadleList[lastWndow]

      if (url !== '') {
        await driver.switchTo().window(newWindowHandle)
        driver.get(url)
      }

      await driver.executeScript("window.open()")
      resolve(newWindowHandle)
    })
  }
}
