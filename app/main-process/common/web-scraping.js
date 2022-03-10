/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */

/* ----------------------------------------------------------------
  ウェブスクレイピング クラス https://qiita.com/penta515/items/074b5c7694b9bcec1043
----------------------------------------------------------------- */
module.exports = class WebScrapingModule {
  constructor(settings) {
    this.settings = settings
    this.request = require('request')
  }

  async getHTMLDataWithAuth() {
    console.log('\nThis is the permission page.')
    const username = this.settings.pageData.username
    const password = this.settings.pageData.password

    const options = {
      url: this.settings.pageData.url,
      method: 'POST',
      auth: {
        user: username,
        password: password
      }
    }

    const self = this
    return new Promise(resolve => {
      self.request(options, (e, response, body) => {
        if (e) {
          resolve(e)
        }

        try {
          resolve(body)
        } catch (e) {
          console.log(`Error ${e}`)

          resolve(null)
        }
      })
    })
  }

  getHTMLData() {
    const self = this
    const url = this.settings.pageData.url
    return new Promise(resolve => {
      self.request(url, (e, response, body) => {
        if (e) {
          console.log(`Error`)
          console.log(e)
          resolve(null)
        }

        try {
          resolve(body)
        } catch (e) {
          colorlog.error(`Error`)
          console.log(e)
          resolve(null)
        }
      })
    })
  }

  checkGetHTMLError(htmlData) {
    const self = this
    return new Promise(async (resolve) => {
      if (!htmlData) {
        resolve(htmlData)
        return
      }
      const is404 = htmlData.match(/404 Not Found/)
      if (is404) {
        console.log('This page 404 error.')
        resolve(newHtmlData)
        return
      }
      const is401 = htmlData.match(/401 Unauthorized/)
      if (is401) {
        //let newHtmlData = await self.getHTMLDataWithAuth()
        //newHtmlData = await self.checkGetHTMLError(newHtmlData)
        resolve(newHtmlData)
        return
      }
      resolve(htmlData)
    })
  }
}
