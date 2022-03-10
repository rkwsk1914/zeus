/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'
/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class HtmlValidation extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      nowTabId: `${this.props.attrHead}-pageCheck-htmlVal-detail-tab`
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
    const result = this.props.result
    if (!result) {
      return true
    }
    return false
  }

  setBadges () {
    const status = this.props.status
    if (status === 'load') {
      return (
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )
    }

    const result = this.props.result
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

  setAlert () {
    const result = this.props.result
    if (!result) {
      return null
    }

    const htmlData = result.htmlData
    const alerts = []
    const is404 = htmlData.match(/404 Not Found/)
    if (is404) {
      alerts.push(
        <div className="alert alert-danger" role="alert" key={1}>
          404 Not Found
        </div>
      )
    }
    const is401 = htmlData.match(/401 Unauthorized/)
    if (is401) {
      alerts.push(
        <div className="alert alert-warning" role="alert" key={2}>
          401 Unauthorized
        </div>
      )
    }

    if (alerts.length <= 0) {
      return null
    }
    return alerts
  }

  setDetail () {
    const result = this.props.result
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

  checkErrorLine (line) {
    const result = this.props.result

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

  setSource () {
    const result = this.props.result
    if (!result) {
      return null
    }

    const codes = []

    const htmlArray = result.htmlArray
    for (let line = 0; line < htmlArray.length; line++) {
      const lineType = this.checkErrorLine(line)

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
      return 'tab-pane fade py-4 overflowBox show active'
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
    const badge = this.setBadges()
    const alerts = this.setAlert()
    const detail = this.setDetail()
    const source = this.setSource()

    /* 描写 */
    return (
      <div className="card">
          <div className="card-header" id={`${this.props.attrHead}-pageCheck-htmlVal-head`}>
            <h5 className="mb-0">
              <button className="btn text-secondary col-3 text-left collapsed" type="button" data-toggle="collapse"
                data-target={`#${this.props.attrHead}-pageCheck-htmlVal-collapse`} aria-expanded="false"
                aria-controls={`${this.props.attrHead}-pageCheck-htmlVal-collapse`}
                disabled={disabled}
                onClick={onShowContent} >
                HTML Validation
              </button>
              {badge}
            </h5>
          </div>

          <div id={`${this.props.attrHead}-pageCheck-htmlVal-collapse`} className="collapse"
            aria-labelledby={`${this.props.attrHead}-pageCheck-htmlVal-head`} data-parent="#project-pageCheck">
            <div className="card-body">
              <h6>HTML Validation</h6>
              {alerts}

              <ul className="nav nav-tabs mt-4" id={`${this.props.attrHead}-pageCheck-htmlVal`} role="tablist">
                <li className="nav-item">
                  <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-htmlVal-detail-tab`)}
                    id={`${this.props.attrHead}-pageCheck-htmlVal-detail-tab`}
                    data-toggle="tab"
                    href={`#${this.props.attrHead}-pageCheck-htmlVal-detail`}
                    role="tab"
                    aria-controls={`${this.props.attrHead}-pageCheck-htmlVal-detail`}
                    aria-selected="true"
                    onClick={doChangeNowTab} >page validation
                    detail</a>
                </li>
                <li className="nav-item">
                  <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-htmlVal-sourceCode-tab`)}
                    id={`${this.props.attrHead}-pageCheck-htmlVal-sourceCode-tab`}
                    data-toggle="tab"
                    href={`#${this.props.attrHead}-pageCheck-htmlVal-sourceCode-tab`}
                    role="tab"
                    aria-controls={`${this.props.attrHead}-pageCheck-htmlVal-sourceCode-tab`}
                    aria-selected="true"
                    onClick={doChangeNowTab} >page all source code</a>
                </li>
              </ul>

              <div className="tab-content" id="pageTabContent">
                <div className={setContentStatus(`${this.props.attrHead}-pageCheck-htmlVal-detail-tab`)}
                  id={`${this.props.attrHead}-pageCheck-htmlVal-detail`}
                  role="tabpanel"
                  aria-labelledby={`${this.props.attrHead}-pageCheck-htmlVal-detail-tab`}>
                    <ul className="list-group list-group-flush">
                      {detail}
                    </ul>
                </div>
                <div className={setContentStatus(`${this.props.attrHead}-pageCheck-htmlVal-sourceCode-tab`)}
                  id={`${this.props.attrHead}-pageCheck-htmlVal-sourceCode`}
                  role="tabpanel"
                  aria-labelledby={`${this.props.attrHead}-pageCheck-htmlVal-sourceCode-tab`}>
                    <div className="container">
                    <pre className="row highlight">
                    {source}
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
HtmlValidation.propTypes = {
  attrHead: PropTypes.string,
  status: PropTypes.string,
  result: PropTypes.object
}
