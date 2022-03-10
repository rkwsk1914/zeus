/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */

/* ----------------------------------------------------------------
ファイル操作クラス
----------------------------------------------------------------- */
module.exports = class FileSystem {
  constructor() {
    /* Node.jsの fs.existsSync を使用し、ファイルの確認をできるようにする*/
    this.Fs = require('fs')
    this.path = require('path')
  }

  /**
   * ファイルコピーの処理
   * @param {*String} origin コピー元ファイルの絶対パス
   * @param {*String} clone コピー先ファイルの絶対パス
   */
  copyFile = (origin, clone) => {
    this.Fs.copyFile(origin, clone, (err) => {
      if (err) {
        console.log(err.stack);
      }
      else {
        // console.log(`Copy： ${clone}`)
      }
    });
  }

  /**
   * ファイル削除
   */
  deleteFile = (deletePath) => {
    try {
      this.Fs.unlinkSync(deletePath)
      // console.log(`delete: ${deletePath}`)
    } catch (error) {
      throw error
    }
  }

  /**
   * ファイルの存在確認
   * @param {*b} filePath 存在確認するファイルの絶対パス
   * @returns {*boolen}
   */
  checkFile = (filePath) => {
    var isExist = false;
    try {
      this.Fs.statSync(filePath);
      isExist = true;
    } catch (err) {
      isExist = false;
    }
    return isExist;
  }

  /**
   * ファイル読み込み
   */
  readFile = (filePath) => {
    const extname = this.path.extname(filePath)
    let data = null
    switch (extname) {
      case '':
        break
      default:
        data = this.Fs.readFileSync(filePath, 'utf-8');
        break
    }
    return data
  }

  /**
   * ファイル内検索
   * @param {*} filePath
   * @param {*} keywords
   * @returns
   */
  grepInFile = (filePath, keywords) => {
    let flag = false
    const data = this.readFile(filePath)
    const match = data.match(keywords)
    if (match) {
      flag = true
    }
    return flag
  }

  /**
   * ファイル書き込み
   * @param {*} filePath
   * @param {*} data
   */
  writeFile = (filePath, data) => {
    try {
      this.Fs.writeFileSync(filePath, data);
      return null
    }catch(e){
      // console.log(`miss write file: ${filePath}`)
      console.log(e)
      return e
    }
  }
}