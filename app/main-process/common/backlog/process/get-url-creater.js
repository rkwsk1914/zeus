const UrlCreater = require('./url-creater.js')

/**
 * 情報取得用のURL生成モジュール
 */
module.exports = class GetUrlCreater extends UrlCreater {
  /**
   * Ajax通信の送信先URLを生成
   *
   * @returns Ajax通信の送信先URL
   */
  doing() {
    const self = this
    return new Promise( resolve => {
      const comPrefix = 'comment-'
      const commentId = self.urlPram.substring(comPrefix.length, self.urlPram.length)
      const jsonUrl = `https://sbweb.backlog.jp/api/v2/issues/${self.ticketId}/comments/${commentId}?apiKey=${self.apiKey}`
      //const jsonUrl = `https://sbweb.backlog.jp/api/v2/issues/${self.ticketId}/comments?apiKey=${self.apiKey}` //全部
      resolve(jsonUrl)
    })
  }
}
