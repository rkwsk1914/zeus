const fetch = require('node-fetch')

/**
 * Fetch受信モジュール
 */
module.exports = class FetchAPIGET {
  constructor () {
    this.fileListCreater = {
      content: []
    }
    this.environment = ''
    this.status = ''
    this.createFileListStartFlag = false
    this.backLogData = {
      environment: '',
      fileList: []
    }
  }

  /**
   * jSONデータの取得
   */
  doing (backLogJsonUrl) {
    const self = this
    let result = null
    return new Promise(async (resolve) => {
      await fetch(backLogJsonUrl)
      .then(async (response) => {
        if(response.status === 404) {
          console.log('\nresponse status 404\n')
          resolve(null)
          return
        }
        /* 通信が成功した場合 */
        /* 通信結果の取得 */
        /* console.log(response) */
        response.json().then(async (data) => {
          /* data を使用した処理を実行する */
          result = await self.getBackLogData(data.content)
          resolve(result)
        })
      })
      /* .then((data) => {
        /* JSONデータの取得 *
        /* console.log(data) *
      }) */
      .catch((error) => {
        /* 通信が失敗した場合 */
        console.error('Backlog URL not found', error)
        resolve(error)
      })

    })
  }

  /**
   * 投入ログからマージに必要なデータの取得
   * environment: 開発環境（マージ元）
   * fileList: マージするファイルリスト
   * 【処理】
   * 1行ずつ上から、投入ログを読み込む
   *
   * @param {*string} jsonData Ajax通信で取得した投入ログ
   */
  getBackLogData (jsonData) {
    const self = this
    return new Promise(async (resolve) => {
      const backLogData = {
        environment: '',
        fileList: []
      }
      let filedata = null
      const backlogComment = jsonData.split(/\n/)
      for (let index = 0; index < backlogComment.length; index++) {
        const backlogCommentLine = backlogComment[index]

        /**
         * 投入ログを精査
         * 対象行だった場合、開発環境の取得または、マージファイルの作成
         */
        if (backlogCommentLine === '***投入環境') {
          const environmentIndex = index + 2
          self.environment = backlogComment[environmentIndex]
          continue
        }

        if (backlogCommentLine === '***修正した全てのファイル ') {
          self.createFileListStartFlag = true
          continue
        }

        if (self.createFileListStartFlag === true) {
          self.status =  await self.setStatus(backlogCommentLine, self.status)
          filedata = await self.createFileData(backlogCommentLine, self.status)
          if (filedata !== undefined) {
            self.fileListCreater.content.push(filedata)
          }
        }
      }

      backLogData.fileList = self.fileListCreater.content
      backLogData.environment = self.environment
      self.backLogData = backLogData
      /* console.log('merge data:', self.backLogData) */
      resolve(self.backLogData)
    })
  }

  /**
   * マージするファイルが、「更新・新規・削除」のどれかを判定する
   * @param {*String} backlogCommentLine 投入ログの1行
   * @param {*String} nowStatus 現在のファイルステータス
   * @returns 更新するファイルステータス
   */
  setStatus (backlogCommentLine, nowStatus) {
    let reslut = nowStatus
    return new Promise(async (resolve) => {
      switch (backlogCommentLine) {
        case '■更新':
          reslut =  'update'
          break
        case '■新規':
          reslut =  'new'
          break
        case '■削除':
          reslut = 'delete'
          break
        default:
          break
      }
      resolve(reslut)
    })
  }

  /**
   * マージするファイルの個別データを生成する
   * @param {*String} backlogCommentLine 投入ログの1行
   * @param {*String} nowStatus 現在のファイルステータス
   * @returns ファイルのデータインスタンス
   */
  createFileData (backlogCommentLine, nowStatus) {
    return new Promise(async (resolve) => {

      const check = backlogCommentLine.match(/(.*\/)?(.*?)\.(\w+)?/)
      /* console.log(check) */
      if (check !== null) {
        const filedata = {
          path: backlogCommentLine,
          status: nowStatus
        }
        resolve(filedata)
        return
      }
      resolve()
      return
    })
  }
}
