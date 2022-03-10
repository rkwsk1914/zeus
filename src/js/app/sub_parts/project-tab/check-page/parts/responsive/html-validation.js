/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'
/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class HtmlValidationResponsive extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      nowTabId: `${this.props.attrHead}-pageCheck-htmlVal-pc-detail-tab`
    }
  }

  /**
   * コンポーネントがDOMにマウント（追加）された直後
   */
  componentDidMount () {
  }

  /**
   * コンポーネントが再レンダーされされた直後
   */
  componentDidUpdate () {}

  /**
   * コンポーネントがDOMにマウント（削除）された直後
   */
  componentWillUnmount () {}

  /* ---------------------------------------------------------------------------------
   * コンポーネント内でのみ使用する関数リスト
  --------------------------------------------------------------------------------- */
  onShowContent (e) {
    const target = e.target
    const collapseId = target.getAttribute('data-target')
    $(collapseId).slideToggle()
  }

  doChangeNowTab (e) {
    e.preventDefault()
    if (!e.target.id) {
      return
    }
    this.setState({
      nowTabId: e.target.id
    })
  }

  setDisabled () {
    const result = {
      PC: this.props.result.PC,
      SP: this.props.result.SP
    }
    if (!result.PC && !result.PC) {
      return true
    }
    return false
  }

  setBadges (device) {
    const status = this.props.status
    if (status === 'load') {
      return (
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )
    }

    const result = this.props.result[device]
    if (!result) {
      return null
    }

    if (result.errorCount === 0 && result.infoCount === 0) {
      const badge = (<span className="badge badge-success ml-2" key={1}>perfect !!</span>)
      return badge
    }

    if (result.errorCount !== 0 || result.infoCount !== 0) {
      const badges = []
      if (result.errorCount !== 0) {
        badges.push(<span className="badge badge-danger ml-2" key={2}>Error<span className="badge badge-light ml-3">{result.errorCount}</span></span>)
      }
      if (result.infoCount !== 0) {
        badges.push(<span className="badge badge-warning ml-2" key={3}>Waring<span className="badge badge-light ml-3">{result.infoCount}</span></span>)
      }
      return badges
    }
    return null
  }

  setAlert (device) {
    const result = this.props.result[device]
    if (!result) {
      return null
    }

    const url = this.props.url
    const htmlData = result.htmlData
    const alerts = [
      <div className="alert alert-primary" role="alert" key={1}>
        Check page: <a href={url} className="alert-link">{url}</a>
      </div>
    ]
    const is404 = htmlData.match(/404 Not Found/)
    if (is404) {
      alerts.push(
        <div className="alert alert-danger" role="alert" key={2}>
        404 Not Found: <a href={url} className="alert-link">{url}</a>
        </div>
      )
    }

    const is401 = htmlData.match(/401 Unauthorized/)
    if (is401) {
      alerts.push(
        <div className="alert alert-warning" role="alert" key={3}>
        401 Unauthorized: <a href={url} className="alert-link">{url}</a>
        </div>
      )
    }

    return alerts
  }

  setDetail (device) {
    const result = this.props.result[device]
    if (!result) {
      return null
    }

    const lists = []

    const messages = result.messages
    let li
    for (let index = 0; index < messages.length; index++) {
      const message = messages[index]
      const type = message.type
      switch (type) {
        case 'info':
          li = (
            <li className="list-group-item" key={index}>
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">{message.subType} <span>line: {message.lastLine}</span></h4>
              <p>{message.message}</p>
              <hr />
              <pre>
<code>
{message.extract}
</code>
</pre>
            </div>
          </li>
          )
          lists.push(li)
          break
        case 'error':
          li = (
            <li className="list-group-item" key={index}>
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error <span>line: {message.lastLine}</span></h4>
              <p>{message.message}</p>
              <hr />
              <pre>
<code>
{message.extract}
</code>
</pre>
            </div>
          </li>
          )
          lists.push(li)
          break
        default:
          break
      }
    }

    return lists
  }

  checkErrorLine (line, device) {
    const result = this.props.result[device]

    const errorLines = result.errorLines
    const infoLines = result.infoLines
    const isErrorLine = errorLines.find(linenum => linenum === line + 1)
    const isInfoLine = infoLines.find(linenum => linenum === line + 1)
    if (isErrorLine) {
      return 'error'
    }

    if (isInfoLine) {
      return 'info'
    }
    return null
  }

  setSource (device) {
    const result = this.props.result[device]
    if (!result) {
      return null
    }

    const codes = []

    const htmlArray = result.htmlArray
    for (let line = 0; line < htmlArray.length; line++) {
      const lineType = this.checkErrorLine(line, device)

      const maxOfLine = htmlArray.length
      const lineDigits = maxOfLine.length
      const numberOfLine = line + 1
      const blankNum = (lineDigits - numberOfLine.length)
      const blank = ' '

      const lineNumber = blank.repeat(blankNum) + numberOfLine
      let code = null
      switch (lineType) {
        case 'info':
          code = [
            <span className="col-1 pr-0" key={line}>{lineNumber}</span>,
            <code className="col-11 html-waring" key={`a-${line}`}>{htmlArray[line]}</code>
          ]
          codes.push(code)
          break
        case 'error':
          code = [
            <span className="col-1 pr-0" key={line}>{lineNumber}</span>,
            <code className="col-11 html-error" key={`a-${line}`}>{htmlArray[line]}</code>
          ]
          codes.push(code)
          break
        default:
          code = [
            <span className="col-1 pr-0" key={line}>{lineNumber}</span>,
            <code className="col-11" key={`a-${line}`}>{htmlArray[line]}</code>
          ]
          codes.push(code)
          break
      }
    }

    return codes
  }

  setMenuTabStatus (id) {
    if (id === this.state.nowTabId) {
      return 'nav-link active'
    }
    return 'nav-link'
  }

  setContentStatus (id) {
    if (id === this.state.nowTabId) {
      return 'tab-pane fade p-4 overflowBox show active'
    }
    return 'tab-pane fade'
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const onShowContent = (e) => this.onShowContent(e)
    const doChangeNowTab = (e) => this.doChangeNowTab(e)
    const setMenuTabStatus = (id) => this.setMenuTabStatus(id)
    const setContentStatus = (id) => this.setContentStatus(id)
    const disabled = this.setDisabled()
    const badgePC = this.setBadges('PC')
    const alertsPC = this.setAlert('PC')
    const detailPC = this.setDetail('PC')
    const sourcePC = this.setSource('PC')
    const badgeSP = this.setBadges('SP')
    const alertsSP = this.setAlert('SP')
    const detailSP = this.setDetail('SP')
    const sourceSP = this.setSource('SP')

    /* 描写 */
    return (
      <div className="card">
          <div className="card-header" id={`${this.props.attrHead}-pageCheck-htmlVal-head`}>
            <h5 className="mb-0 d-flex">
              <button className="btn text-secondary col-3 text-left collapsed" type="button" data-toggle="collapse"
                data-target={`#${this.props.attrHead}-pageCheck-htmlVal-collapse`} aria-expanded="false"
                aria-controls={`${this.props.attrHead}-pageCheck-htmlVal-collapse`}
                disabled={disabled}
                onClick={onShowContent} >
                HTML Validation
              </button>
              <div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="font-weight-normal text-secondary">PC: </span>
                  {badgePC}
                </div>
                <div className="mt-2 d-flex align-items-center justify-content-between">
                  <span className="font-weight-normal text-secondary">SP: </span>
                  {badgeSP}
                </div>
              </div>
            </h5>
          </div>

          <div id={`${this.props.attrHead}-pageCheck-htmlVal-collapse`} className="collapse"
            aria-labelledby={`${this.props.attrHead}-pageCheck-htmlVal-head`} data-parent="#project-pageCheck">
            <div className="card-body">
              <h6>HTML Validation</h6>

              <ul className="nav nav-tabs mt-4" id={`${this.props.attrHead}-pageCheck-htmlVal`} role="tablist">
                <li className="nav-item">
                  <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-htmlVal-pc-detail-tab`)}
                    id={`${this.props.attrHead}-pageCheck-htmlVal-pc-detail-tab`}
                    data-toggle="tab"
                    href={`#${this.props.attrHead}-pageCheck-htmlVal-pc-detail`}
                    role="tab"
                    aria-controls={`${this.props.attrHead}-pageCheck-htmlVal-pc-detail`}
                    aria-selected="true"
                    onClick={doChangeNowTab} >PC page validation
                    detail</a>
                </li>
                <li className="nav-item">
                  <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-htmlVal-pc-sourceCode-tab`)}
                    id={`${this.props.attrHead}-pageCheck-htmlVal-pc-sourceCode-tab`}
                    data-toggle="tab"
                    href={`#${this.props.attrHead}-pageCheck-htmlVal-pc-sourceCode-tab`}
                    role="tab"
                    aria-controls={`${this.props.attrHead}-pageCheck-htmlVal-pc-sourceCode-tab`}
                    aria-selected="true"
                    onClick={doChangeNowTab} >PC page all source code</a>
                </li>
                <li className="nav-item">
                  <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-htmlVal-sp-detail-tab`)}
                    id={`${this.props.attrHead}-pageCheck-htmlVal-sp-detail-tab`}
                    data-toggle="tab"
                    href={`#${this.props.attrHead}-pageCheck-htmlVal-sp-detail`}
                    role="tab"
                    aria-controls={`${this.props.attrHead}-pageCheck-htmlVal-sp-detail`}
                    aria-selected="true"
                    onClick={doChangeNowTab} >SP page validation
                    detail</a>
                </li>
                <li className="nav-item">
                  <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-htmlVal-sp-sourceCode-tab`)}
                    id={`${this.props.attrHead}-pageCheck-htmlVal-sp-sourceCode-tab`}
                    data-toggle="tab"
                    href={`#${this.props.attrHead}-pageCheck-htmlVal-sp-sourceCode-tab`}
                    role="tab"
                    aria-controls={`${this.props.attrHead}-pageCheck-htmlVal-sp-sourceCode-tab`}
                    aria-selected="true"
                    onClick={doChangeNowTab} >SP page all source code</a>
                </li>
              </ul>

              <div className="tab-content" id="pageTabContent">
                <div className={setContentStatus(`${this.props.attrHead}-pageCheck-htmlVal-pc-detail-tab`)}
                  id={`${this.props.attrHead}-pageCheck-htmlVal-pc-detail`}
                  role="tabpanel"
                  aria-labelledby={`${this.props.attrHead}-pageCheck-htmlVal-pc-detail-tab`}>

                    {alertsPC}

                    <ul className="list-group list-group-flush">
                      {detailPC}
                    </ul>
                </div>
                <div className={setContentStatus(`${this.props.attrHead}-pageCheck-htmlVal-pc-sourceCode-tab`)}
                  id={`${this.props.attrHead}-pageCheck-htmlVal-pc-sourceCode`}
                  role="tabpanel"
                  aria-labelledby={`${this.props.attrHead}-pageCheck-htmlVal-pc-sourceCode-tab`}>
                    <div className="container">
                      <pre className="row highlight">
                        {sourcePC}
                      </pre>
                    </div>
                </div>
                <div className={setContentStatus(`${this.props.attrHead}-pageCheck-htmlVal-sp-detail-tab`)}
                  id={`${this.props.attrHead}-pageCheck-htmlVal-sp-detail`}
                  role="tabpanel"
                  aria-labelledby={`${this.props.attrHead}-pageCheck-htmlVal-sp-detail-tab`}>

                    {alertsSP}

                    <ul className="list-group list-group-flush">
                      {detailSP}
                    </ul>
                </div>
                <div className={setContentStatus(`${this.props.attrHead}-pageCheck-htmlVal-sp-sourceCode-tab`)}
                  id={`${this.props.attrHead}-pageCheck-htmlVal-sp-sourceCode`}
                  role="tabpanel"
                  aria-labelledby={`${this.props.attrHead}-pageCheck-htmlVal-sp-sourceCode-tab`}>
                    <div className="container">
                      <pre className="row highlight">
                        {sourceSP}
                      </pre>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
HtmlValidationResponsive.propTypes = {
  attrHead: PropTypes.string,
  status: PropTypes.string,
  result: PropTypes.object,
  url: PropTypes.string
}
