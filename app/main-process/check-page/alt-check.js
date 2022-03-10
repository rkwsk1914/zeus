/* ----------------------------------------------------------------
  プラグイン
----------------------------------------------------------------- */
const jsdom = require('jsdom')
const { JSDOM } = jsdom

/* ----------------------------------------------------------------
  クラス
----------------------------------------------------------------- */
module.exports = class ALtChecker {
  constructor() {
    this.result = {
      itemsCount: 0,
      errorCount: 0,
      items: []
    }
  }

  readHTML (htmlData) {
    const dom = new JSDOM(htmlData)
    const document = dom.window.document
    const imgTags = document.getElementsByTagName('img')

    console.log('\nimg Tags :', imgTags.length)

    this.result.itemsCount = imgTags.length

    for (let index = 0; index < imgTags.length; index++) {
      const imgTag = imgTags[index]
      const item = {
        html: imgTag.outerHTML,
        error: false
      }
      const alt = imgTag.getAttribute('alt')
      if(!alt || alt === '') {
        this.result.errorCount++
        item.error = true
      }
      this.result.items.push(item)
    }
  }

  checkAlt (htmlData) {
    const self = this
    return new Promise(resolve => {

      self.readHTML(htmlData)
      const result = self.result
      resolve(result)
    })
  }
}
