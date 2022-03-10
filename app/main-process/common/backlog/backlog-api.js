const GetUrlCreater = require('./process/get-url-creater.js')
const FetchAPIGET = require('./process/fetch-api-get.js')
const PostUrlCreater = require('./process/post-url-creater.js')
const FetchAPIPOST = require('./process/fetch-api-post.js')

/**
 * BacklogApiに関する処理メインプロセス
 * @constructor
 * @this {BacklogApi}
 */
module.exports = class BacklogApi {
  constructor (url) {
    this.getUrlCreater = new GetUrlCreater(url)
    this.fetchAPIGET = new FetchAPIGET()

    this.postUrlCreater = new PostUrlCreater(url)
    this.fetchAPIPOST = new FetchAPIPOST()
  }

  /**
   * マージするファイルデータとマージ元データを取得
   */
  getMergeData () {
    const self = this
    let result = null
    return new Promise(async (resolve) => {
      const getUrlCreater = self.getUrlCreater
      const fetchAPIGET = self.fetchAPIGET
      const backLogJsonUrl = await getUrlCreater.doing()
      result = await fetchAPIGET.doing(backLogJsonUrl)
      resolve(result)
    })
  }

  /**
   * マージ完了のコミットログを送信
   */
  postMergeCommit (svnComment) {
    const self = this
    let result = null
    return new Promise(async (resolve) => {
      const postUrlCreater = self.postUrlCreater
      const fetchAPIPOST = self.fetchAPIPOST
      const backLogJsonUrl = await postUrlCreater.doing()

      const commitData = {
        content: svnComment
      }
      result = await fetchAPIPOST.doing(commitData, backLogJsonUrl)
      resolve()
    })
  }
}
