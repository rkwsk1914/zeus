/* ----------------------------------------------------------------
  プラグイン
----------------------------------------------------------------- */
const svnUltimate = require('node-svn-ultimate')

/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */

/* ----------------------------------------------------------------
  SVN関連 クラス
----------------------------------------------------------------- */
module.exports = class SvnSystem {
  constructor() {
  }

  getSVNStatus(dir) {
    return new Promise(resolve => {
      svnUltimate.commands.status(dir, null, function (err, data) {
        if(err) {
          // console.log(err)
        }
        if (!data) {
          resolve(null)
        }
        if (data) {
          // console.log(data)
          resolve(data)
        }
      })
    })
  }

  getSVNdel(filePath) {
    return new Promise(resolve => {
      svnUltimate.commands.del(filePath, null, function (err, data) {
        if(err) {
          // console.log(err)
        }
        if (!data) {
          resolve(null)
        }
        if (data) {
          // console.log(data)
          resolve(data)
        }
      })
    })
  }

  getSVNUpDate(dir) {
    return new Promise(resolve => {
      svnUltimate.commands.update(dir, null, function (err, data) {
        if(err) {
          // console.log(err)
        }
        if (!data) {
          resolve(null)
        }
        if (data) {
          // console.log(data)
          resolve(data)
        }
      })
    })
  }
}
