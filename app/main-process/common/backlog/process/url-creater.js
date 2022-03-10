/**
 * URL生成の親モジュール
 */
module.exports = class UrlCreater {
  constructor (url) {
    this.prefix = 'https://sbweb.backlog.jp/view/'
    this.apiKey = 'AwsNnM4SiMasJlwLFFoaNpKcU4XZ6bNUUYl10S6G0oblZXSVEUXxa51c61ttPjts&'
    this.idStr = url.substring(this.prefix.length, url.length)
    this.array = this.idStr.split('#')
    this.ticketId = this.array[0]
    this.urlPram = this.array[1]
  }
}
