const fetch = require('node-fetch')

/**
 * Fetch送信モジュール
 */
module.exports = class FetchAPIPOST {
  doing (commitData, backLogJsonUrl) {
    return new Promise(async (resolve) => {
      fetch(backLogJsonUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commitData)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      resolve()
    })
  }
}
