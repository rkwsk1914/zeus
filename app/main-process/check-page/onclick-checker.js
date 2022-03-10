/* ----------------------------------------------------------------
  インポート
----------------------------------------------------------------- */
const jsdom = require('jsdom')
const { JSDOM } = jsdom

/* ----------------------------------------------------------------
  計測タグの要素データ クラス
----------------------------------------------------------------- */
class MeasurementItem {
  constructor(element) {
    this.domData = element
    this.className = element.getAttribute('class')
    this.dom = element.tagName
    this.errorMsg = ''
    this.hrefUrl = element.getAttribute('href')
    this.value = element.innerHTML
    this.wtr = {
      title: element.getAttribute('title'),
      dataSbaTarget: element.getAttribute('data-sba-target')
    }
    this.ctr = this.getCtrValue(element)
    this.sbaClick = this.isSbaClickClassNameInit(element)
    this.childs = []
    this.check = {
      format: this.checkOnclickFormat(element),
      ctrAttr: this.checkCTRAttrData(element),
      wtrAttr: this.checkWTRAttrData(element),
      childs: true
    }
    this.getChildNodes(element)
    this.checkChildsState(this.childs, this.wtr)
    this.status = this.checkStatus()
  }

  getCtrValue(element) {
    const ctrVal = {
      category: null,
      action: null,
      label: null,
    }

    const onclick = element.getAttribute('onclick')
    if (!onclick) {
      return ctrVal
    }
    let ctrStr = onclick.match(/\'(.|\-|\_|\･)*\'\,\s?\'(.|\-|\_|\･)*\'\,\s?\'(.|\-|\_|\･)*\'/)
    ctrStr = ctrStr[0].replaceAll(/\,\s?/g, ',')
    const ctrArray = ctrStr.split(/\,/)
    ctrVal.category = ctrArray[0]
    ctrVal.action = ctrArray[1]
    ctrVal.label = ctrArray[2]
    return ctrVal
  }

  isSbaClickClassNameInit(element) {
    const elmClassName = element.className
    const isSbaClick = elmClassName.match(/sba-click/)
    if (isSbaClick) {
      return true
    }
    this.errorMsg = this.errorMsg + `The class attribute "sba-click" is not set. \n`
    return false
  }

  isSbaClickClassName(element) {
    return new Promise(resolve => {
      const elmClassName = element.className
      const isSbaClick = elmClassName.match(/sba-click/)
      if (isSbaClick) {
        resolve(true)
        return
      }
      resolve(false)
      return
    })
  }

  getChildNodes(element) {
    const nodes = element.childNodes
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index]
      if (node.nodeName !== '#text' && node.nodeName !== 'BR' && node.nodeName !== 'IMG') {
        const childitem = new ChildMeasurementItem(node)
        this.childs.push(childitem)
      }
    }
  }

  checkCTRAttrData(element) {
    const isOnclick = element.hasAttribute('onclick')
    if (isOnclick) {
      return true
    }
    this.errorMsg = this.errorMsg + `Not enough CTR attributes. \n`
    return false
  }

  checkWTRAttrData(element) {
    const isTitle = element.hasAttribute('title')
    const isDataSbaTarget = element.hasAttribute('data-sba-target')
    if (isTitle && isDataSbaTarget && this.sbaClick) {
      return true
    }
    this.errorMsg = this.errorMsg + `Not enough WTR attributes. \n`
    return false
  }

  checkOnclickFormat(element) {
    const onclick = element.getAttribute('onclick')
    if (!onclick) {
      this.errorMsg = this.errorMsg + `CTR Attribute undefind. \n`
      return false
    }
    const checkFormat = onclick.match(/(_ga)\.(spotEvent)\(\'(.|\-|\_|\･)*\'\,\s?\'(.|\-|\_|\･)*\'\,\s?\'(.|\-|\_|\･)*\'\)/)
    if (checkFormat) {
      return true
    }
    this.errorMsg = this.errorMsg + `CTR format error. \n`
    return false
  }

  checkChildsState(childs, wtr) {
    if (!childs) {
      this.check.childs = true
      return
    }

    for (let index = 0; index < childs.length; index++) {
      const child = childs[index]
      const tagName = child.domData.tagName
      const className = child.domData.getAttribute('class')
      if (child.noSetAttr === false) {
        this.check.childs = false
        this.errorMsg = this.errorMsg + `[Child element] ${tagName} "${className}" Not enough attributes. \n`
        return
      }
      if (wtr.title !== child.wtr.title || wtr.dataSbaTarget !== child.wtr.dataSbaTarget) {
        this.check.childs = false
        this.errorMsg = this.errorMsg + `[Child element] ${tagName} "${className}" The WTR attribute does not match the attribute value of the parent element. \n`
        return
      }

      if (child.check.childs === false) {
        this.check.childs = false
        this.errorMsg = this.errorMsg + child.errorMsg
        return
      }
    }
  }

  checkCTRWTR(element) {
    const self = this
    return new Promise(async (resolve) => {
      const isTitle = element.hasAttribute('title')
      const isDataSbaTarget = element.hasAttribute('data-sba-target')
      const isOnclick = element.hasAttribute('onclick')
      const isSbaClick = await self.isSbaClickClassName(element)
      if (isTitle || isDataSbaTarget || isOnclick || isSbaClick) {
        resolve(true)
        return
      }
      resolve(false)
      return
    })
  }

  checkStatus() {
    const self = this
    const check = self.check
    const errorMsg = self.errorMsg
    const errorArray = errorMsg.split('\n')
    const result = {
      ctrUse: true,
      wtrUse: true,
      ctrError: false,
      wtrError: false,
      errorCount: (errorArray.length - 1)
    }

    //console.log(`check.format ${check.format} || check.wtrAttr ${check.wtrAttr} || check.ctrAttr ${check.ctrAttr} ||check.childs ${check.childs}`)

    if(!self.ctr.action && !self.ctr.category && !self.ctr.label) {
      result.ctrUse = false
    }

    if (check.format === false || check.ctrAttr === false) {
      result.ctrError = true
    }

    if (!self.wtr.title && !self.wtr.dataSbaTarget && !self.sbaClick) {
      result.wtrUse = false
    }

    if (check.wtrAttr === false || check.childs === false) {
      result.wtrError = true
    }

    return result
  }
}

/* ----------------------------------------------------------------
  計測タグの子要素 クラス
----------------------------------------------------------------- */
class ChildMeasurementItem {
  constructor(element) {
    //console.log(element)
    this.domData = element
    this.errorMsg = ''
    this.className = element.getAttribute('class')
    this.dom = element.tagName
    this.value = element.innerHTML
    this.wtr = {
      title: element.getAttribute('title'),
      dataSbaTarget: element.getAttribute('data-sba-target')
    }
    //this.sbaClick = this.isSbaClickClassName(element)
    this.childs = []
    this.check = {
      wtrAttr: this.checkWTRAttrData(element),
      childs: true
    }
    this.getChildNodes(element)
    this.checkChildsState(this.childs, this.wtr)
  }

  isSbaClickClassName(element) {
    const elmClassName = element.className
    const isSbaClick = elmClassName.match(/sba-click/)
    if (isSbaClick) {
      return true
    }
    this.errorMsg = this.errorMsg + `[Child element] The class attribute "sba-click" is not set. \n`
    return false
  }

  checkWTRAttrData(element) {
    const isTitle = element.hasAttribute('title')
    const isDataSbaTarget = element.hasAttribute('data-sba-target')
    if (isTitle && isDataSbaTarget) {
      return true
    }
    this.errorMsg = this.errorMsg + `[Child element] Not enough WTR attributes. \n`
    return false
  }

  getChildNodes(element) {
    const nodes = element.childNodes
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index]
      if (node.nodeName !== '#text' && node.nodeName !== 'BR' && node.nodeName !== 'IMG') {
        const childitem = new ChildMeasurementItem(node)
        this.childs.push(childitem)
      }
    }
  }

  checkChildsState(childs, wtr) {
    if (!childs) {
      this.check.childs = true
      return
    }

    for (let index = 0; index < childs.length; index++) {
      const child = childs[index]
      const tagName = child.domData.tagName
      const className = child.domData.getAttribute('class')
      if (child.noSetAttr === false) {
        this.check.childs = false
        this.errorMsg = this.errorMsg + `[Child element] ${tagName} "${className}" Not enough attributes. \n`
        return
      }
      if (wtr.title !== child.wtr.title || wtr.dataSbaTarget !== child.wtr.dataSbaTarget) {
        this.check.childs = false
        this.errorMsg = this.errorMsg + `[Child element] ${tagName} "${className}" The WTR attribute does not match the attribute value of the parent element. \n`
        return
      }

      if (child.check.childs === false) {
        this.check.childs = false
        this.errorMsg = this.errorMsg + child.errorMsg
        return
      }
    }
  }
}

/* ----------------------------------------------------------------
  計測タグの要素リスト作成 クラス
----------------------------------------------------------------- */
class MeasurementListMaker {
  constructor(htmlWindow) {
    this.document = htmlWindow.document
  }

  getCtrElements() {
    const self = this
    return new Promise(resolve => {
      const document = self.document
      const result = document.querySelectorAll('[onclick]')
      resolve(result)
    })
  }

  getSbaClickElements() {
    const self = this
    return new Promise(resolve => {
      const document = self.document
      const result = document.getElementsByClassName('sba-click')
      resolve(result)
    })
  }

  getWtrTitleElements() {
    const self = this
    return new Promise(resolve => {
      const document = self.document
      const result = document.querySelectorAll('[title]')
      resolve(result)
    })
  }

  getWtrDataSbaTargetElements() {
    const self = this
    return new Promise(resolve => {
      const document = self.document
      const result = document.querySelectorAll('[data-sba-target]')
      resolve(result)
    })
  }

  checkExistItem(element, list) {
    const self = this
    let result = false
    return new Promise(async (resolve) => {
      if (list.length === 0 || !list) {
        resolve(result)
        return
      }

      for (let index = 0; index < list.length; index++) {
        const MeasurementItem = list[index];
        if (MeasurementItem.domData === element) {
          result = true
          resolve(result)
          return
        }
        const isChildExist = await self.checkExistItem(element, MeasurementItem.childs)
        if (isChildExist) {
          result = true
          resolve(result)
          return
        }
      }
      resolve(result)
    })
  }

  checkChildNode(element) {
    const self = this
    return new Promise(async (resolve) => {
      const parent = element.parentNode

      const item = new MeasurementItem(element)
      const isCTRWTR = await item.checkCTRWTR(parent)
      if (isCTRWTR) {
        resolve(true)
        return
      }
      resolve(false)
      return
    })
  }

  createList() {
    const self = this
    const list = []
    return new Promise(async (resolve) => {

      const addlist = (elements) => {
        const self = this
        return new Promise(async (resolve) => {
          if (elements.length === 1) {
            const element = elements[0]
            const isExist = await self.checkExistItem(element, list)
            const isChild = await self.checkChildNode(element)
            if (!isExist && !isChild) {
              const item = new MeasurementItem(element)
              list.push(item)
            }
            resolve()
            return
          }

          for (let index = 0; index < elements.length; index++) {
            const element = elements[index]
            const isExist = await self.checkExistItem(element, list)
            const isChild = await self.checkChildNode(element)
            if (!isExist && !isChild) {
              const item = new MeasurementItem(element)
              list.push(item)
            }
          }
          resolve()
          return
        })
      }

      let elements
      elements = await self.getCtrElements()
      await addlist(elements)
      elements = await self.getSbaClickElements()
      await addlist(elements)
      elements = await self.getWtrTitleElements()
      await addlist(elements)
      elements = await self.getWtrDataSbaTargetElements()
      await addlist(elements)
      resolve(list)
    })
  }
}
/* ----------------------------------------------------------------
  クラス
----------------------------------------------------------------- */
module.exports = class OnClickChecker {
  constructor() {
  }

  doing(htmlData) {
    const self = this
    return new Promise(async (resolve) => {
      const dom = new JSDOM(htmlData)
      const MM = new MeasurementListMaker(dom.window)
      const list = await MM.createList()
      const count = await self.countError(list)
      const reslut = {
        list: list,
        count: count
      }
      resolve(reslut)
    })
  }

  countError(list) {
    const self = this
    return new Promise(async (resolve) => {
      const reslut = {
        itemCount: list.length,
        ctrItemCount: 0,
        wtrItemCount: 0,
        ctrError: 0,
        wtrError: 0,
        totalError: 0
      }
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        const status = item.status
        if (status.ctrUse && status.ctrError) {
          reslut.ctrError++
        }

        if (status.wtrUse && status.wtrError) {
          reslut.wtrError++
        }

        if (status.ctrUse) {
          reslut.ctrItemCount++
        }

        if (status.wtrUse) {
          reslut.wtrItemCount++
        }

        if (status.ctrUse && status.ctrError || status.wtrUse && status.wtrError) {
          reslut.totalError++
        }
      }
      resolve(reslut)
    })
  }

}
