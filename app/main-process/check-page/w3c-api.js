/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */
const fetch = require('node-fetch')

/* ----------------------------------------------------------------
  W3c Validator Web Service API クラス
----------------------------------------------------------------- */
module.exports = class W3cApi {
  constructor() {
    this.result = {
      errorCount: 0,
      infoCount: 0,
      errorLines: [],
      infoLines: [],
      htmlData: null,
      htmlArray: null,
      messages: null
    }
  }

  getErrorLines(messages) {
    return new Promise(resolve => {
      const reslut = {
        infoLines: [],
        errorLines: []
      }

      for (let index = 0; index < messages.length; index++) {
        const type = messages[index].type
        const lastLine = messages[index].lastLine
        switch (type) {
          case 'info':
            reslut.infoLines.push(lastLine)
            break
          case 'error':
            reslut.errorLines.push(lastLine)
            break
          default:
            break
        }
      }

      resolve(reslut)
    })
  }

  /**
   * エラー数カウント
   */
  countMessages(data) {
    return new Promise(resolve => {
      const messages = data.messages
      let errorCount = 0
      let infoCount = 0

      messages.forEach(message => {
        const type = message.type
        switch (type) {
          case 'info':
            infoCount++
            break
          case 'error':
            errorCount++
            break
          default:
            break
        }
      })

      const result = {
        errorCount: errorCount,
        infoCount: infoCount
      }
      resolve(result)
    })
  }


  doFetch(htmlData) {
    const self = this
    return new Promise(async (resolve) => {
      /**
       * Fetch API
       * https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch
       */
      await fetch('https://validator.w3.org/nu/?out=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: htmlData,
      })
        .then((response) => {    /* 通信が成功した場合 */
          /* 通信結果の取得 */
          //console.log(response)
          return response.json()
        })
        .then(async (data) => {
          /* JSONデータの取得 */
          //console.log(data)
          self.result.htmlData = htmlData
          self.result.htmlArray = htmlData.split('\n')

          self.result.messages = data.messages

          const count = await self.countMessages(data)
          self.result.errorCount = count.errorCount
          self.result.infoCount = count.infoCount

          const linesData = await self.getErrorLines(data.messages)
          self.result.errorLines = linesData.errorLines
          self.result.infoLines = linesData.infoLines
          resolve(self.result)
        })
        .catch((error) => {
          /* 通信が失敗した場合 */
          console.log(error)
          resolve(error)
        })
    })
  }

}
