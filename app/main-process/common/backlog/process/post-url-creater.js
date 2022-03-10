const UrlCreater = require('./url-creater.js')

/**
 * 情報送信用のURLモジュール
 */
module.exports = class PostUrlCreater extends UrlCreater {
  /**
   * Ajax通信の送信先URLを生成
   * @returns Ajax通信の送信先URL
   */
  doing () {
    const self = this
    return new Promise( resolve => {
      const jsonUrl = `https://sbweb.backlog.jp/api/v2/issues/${self.ticketId}/comments?apiKey=${self.apiKey}`
      resolve(jsonUrl)
    })
  }
}
