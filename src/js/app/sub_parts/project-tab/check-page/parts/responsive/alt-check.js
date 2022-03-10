/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'
/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class AltCheckResponsive extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      nowTabId: `${this.props.attrHead}-pageCheck-altCheck-pc-detail-tab`
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

    if (result.errorCount === 0) {
      const badges = [
        <span key={1} className="badge badge-info">img Tags<span className="badge badge-light ml-3">{result.itemsCount}</span></span>,
        <span key={2} className="badge badge-success ml-3">All Alt OK !!</span>
      ]
      return badges
    }

    if (result.errorCount !== 0) {
      const badges = [
        <span key={1} className="badge badge-info">img Tags<span className="badge badge-light ml-3">{result.itemsCount}</span></span>,
        <span key={2} className="badge badge-danger ml-3">Error<span className="badge badge-light ml-3">{result.errorCount}</span></span>
      ]
      return badges
    }
    return null
  }

  setResult (device) {
    const result = this.props.result[device]
    if (!result) {
      return null
    }

    let alert = null
    if (result.errorCount === 0) {
      alert = (
        <div className="alert alert-success" role="alert">
          All img tags alt OK !!
        </div>
      )
    }

    if (result.errorCount !== 0) {
      alert = (
        <div className="alert alert-danger" role="alert">
          Some img tags do not have &quot;alt&quot; set.
        </div>
      )
    }

    const items = result.items
    const lists = []
    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      let li = null
      if (item.error === true) {
        li = (
          <li className="list-group-item" key={index}>
          <pre className="highlight"><code className="html-error">
          {item.html}
          </code></pre>
          </li>
        )
      } else {
        li = (
          <li className="list-group-item" key={index}>
          <pre className="highlight"><code>
          {item.html}
          </code></pre>
          </li>
        )
      }
      lists.push(li)
    }

    return (
      <div>
        <h6>ALT Check</h6>
        {alert}
        <ul className="list-group list-group-flush">
          {lists}
        </ul>
      </div>
    )
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

  doChangeNowTab (e) {
    e.preventDefault()
    if (!e.target.id) {
      return
    }
    this.setState({
      nowTabId: e.target.id
    })
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
    const badgeSP = this.setBadges('PC')
    const resultPC = this.setResult('SP')
    const resultSP = this.setResult('SP')

    /* 描写 */
    return (
      <div className="card">
      <div className="card-header" id={`${this.props.attrHead}-pageCheck-altCheck-head`}>
        <h5 className="mb-0 d-flex">
          <button className="btn text-secondary col-3 text-left collapsed" type="button" data-toggle="collapse"
            data-target={`#${this.props.attrHead}-pageCheck-altCheck-collapse`} aria-expanded="false"
            aria-controls={`${this.props.attrHead}-pageCheck-altCheck-collapse`}
            disabled={disabled}
            onClick={onShowContent} >
            ALT Check
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
      <div id={`${this.props.attrHead}-pageCheck-altCheck-collapse`} className="collapse"
        aria-labelledby={`${this.props.attrHead}-pageCheck-altCheck-head`} data-parent="#project-pageCheck">
          <div className="card-body">
          <ul className="nav nav-tabs mt-4" id={`${this.props.attrHead}-pageCheck-altCheck`} role="tablist">
            <li className="nav-item">
              <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-altCheck-pc-detail-tab`)}
                id={`${this.props.attrHead}-pageCheck-altCheck-pc-detail-tab`}
                data-toggle="tab"
                href={`#${this.props.attrHead}-pageCheck-altCheck-pc-detail`}
                role="tab"
                aria-controls={`${this.props.attrHead}-pageCheck-altCheck-pc-detail`}
                aria-selected="true"
                onClick={doChangeNowTab} >PC page
                detail</a>
            </li>
            <li className="nav-item">
              <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-altCheck-sp-detail-tab`)}
                id={`${this.props.attrHead}-pageCheck-altCheck-sp-detail-tab`}
                data-toggle="tab"
                href={`#${this.props.attrHead}-pageCheck-altCheck-sp-detail`}
                role="tab"
                aria-controls={`${this.props.attrHead}-pageCheck-altCheck-sp-detail`}
                aria-selected="true"
                onClick={doChangeNowTab} >SP page
                detail</a>
            </li>
          </ul>

          <div className="tab-content" id="pageTabContent">
            <div className={setContentStatus(`${this.props.attrHead}-pageCheck-altCheck-pc-detail-tab`)}
              id={`${this.props.attrHead}-pageCheck-altCheck-pc-detail`}
              role="tabpanel"
              aria-labelledby={`${this.props.attrHead}-pageCheck-altCheck-pc-detail-tab`}>
                {resultPC}
            </div>
            <div className={setContentStatus(`${this.props.attrHead}-pageCheck-altCheck-sp-detail-tab`)}
              id={`${this.props.attrHead}-pageCheck-altCheck-sp-detail`}
              role="tabpanel"
              aria-labelledby={`${this.props.attrHead}-pageCheck-altCheck-sp-detail-tab`}>
                {resultSP}
            </div>
          </div>
        <div className="mt-3 mb-5 form-group d-flex justify-content-start align-items-center">
          <div className="col-3 mx-auto">
            <button
            type="button"
            className="btn btn-outline-secondary col-12"
            data-target={`#${this.props.attrHead}-pageCheck-altCheck-collapse`}
            aria-controls={`${this.props.attrHead}-pageCheck-altCheck-collapse`}
            onClick={onShowContent}
            >
            close
          </button>
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
AltCheckResponsive.propTypes = {
  attrHead: PropTypes.string,
  status: PropTypes.string,
  result: PropTypes.object,
  url: PropTypes.string
}
