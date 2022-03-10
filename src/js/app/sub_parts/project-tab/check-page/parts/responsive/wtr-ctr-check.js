/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'
/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class WTRandCTRCheckResponsive extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      nowTabId: `${this.props.attrHead}-pageCheck-wtrCtr-pc-detail-tab`
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

    const count = result.count
    if (count.totalError === 0) {
      const badges = [
        <span key={1} className="badge badge-info">WTR CTR items<span className="badge badge-light ml-3">{count.itemCount}</span></span>,
        <span key={2} className="badge badge-success ml-3">All WTR & CTR OK !!</span>
      ]
      return badges
    }

    if (count.totalError !== 0) {
      const badges = [
        <span key={1} className="badge badge-info">WTR CTR items<span className="badge badge-light ml-3">{count.itemCount}</span></span>,
        <span key={2} className="badge badge-danger ml-3">Error<span className="badge badge-light ml-3">{count.totalError}</span></span>
      ]
      return badges
    }
    return null
  }

  setTable (device) {
    const result = this.props.result[device]
    if (!result) {
      return null
    }
    const count = result.count
    return (
      <table className="table table-sm col-6 table-striped mx-auto">
        <tbody>
          <tr>
            <th scope="row">WTR CTR items</th>
            <td>{count.itemCount} (WTR items : {count.wtrItemCount} , CTR items : {count.ctrItemCount})</td>
          </tr>
          <tr>
            <th scope="row">Error items</th>
            <td>{count.totalError}</td>
          </tr>
          <tr>
            <th scope="row"> WTR Error items</th>
            <td>{count.wtrError} / {count.wtrItemCount} (error items / WTR items)</td>
          </tr>
          <tr>
            <th scope="row"> CTR Error items</th>
            <td>{count.ctrError} / {count.ctrItemCount} (error items / CTR items)</td>
          </tr>
        </tbody>
      </table>
    )
  }

  setListStatus (status) {
    const reslut = {
      className: '',
      msg: ''
    }
    if (status.ctrUse && status.ctrError && status.wtrUse && status.wtrError) {
      reslut.msg = `CTR WTR ${status.errorCount} errors.`
      reslut.className = 'alert-danger'
      return reslut
    }

    if (!status.wtrUse && status.ctrUse && status.ctrError) {
      reslut.msg = `CTR ${status.errorCount} errors.`
      reslut.className = 'alert-danger'
      return reslut
    }

    if (!status.ctrUse && status.wtrUse && status.wtrError) {
      reslut.msg = `WTR ${status.errorCount} errors.`
      reslut.className = 'alert-danger'
      return reslut
    }

    if (!status.wtrUse && status.ctrUse && !status.ctrError) {
      reslut.msg = 'CTR OK. WTR not set.'
      reslut.className = 'alert-primary'
      return reslut
    }

    if (!status.ctrUse && status.wtrUse && !status.wtrError) {
      reslut.msg = 'WTR OK. CTR not set.'
      reslut.className = 'alert-info'
      return reslut
    }

    reslut.msg = 'CTR WTR OK.'
    reslut.className = 'alert-success'
    return reslut
  }

  setDetail (device) {
    const result = this.props.result[device]
    if (!result) {
      return true
    }

    const list = result.list
    const detail = []

    for (let index = 0; index < list.length; index++) {
      const item = list[index]
      const status = this.setListStatus(item.status)
      const detailItem = (
        <li className="list-group-item" key={index}>
          <div className={`alert ${status.className}`} role="alert">
            <h4 className="alert-heading">{status.msg}</h4>
            <hr />
            <table className="table table-sm table-borderless mb-0 wtr-ctr-table">
              <tbody>
                <tr>
                  <th scope="row" rowSpan="4">Dom</th>
                  <th>Tag Name</th>
                  <td>{item.dom}</td>
                </tr>
                <tr>
                  <th>Dom Class Name</th>
                  <td>{item.className}</td>
                </tr>
                <tr>
                  <th>Dom href Url </th>
                  <td>{item.hrefUrl}</td>
                </tr>
                <tr>
                  <th>Dom value</th>
                  <td>
                    <pre>
    <code>
  {item.value}
    </code>
    </pre>
                  </td>
                </tr>
                <tr>
                  <th scope="row" rowSpan="3">CTR</th>
                  <th>category </th>
                  <td>{item.ctr.category}</td>
                </tr>
                <tr>
                  <th>action </th>
                  <td>{item.ctr.action}</td>
                </tr>
                <tr>
                  <th>label</th>
                  <td>{item.ctr.label}</td>
                </tr>
                <tr>
                  <th scope="row" rowSpan="3">WTR</th>
                  <th>title</th>
                  <td>{item.wtr.title}</td>
                </tr>
                <tr>
                  <th>data-sba-target</th>
                  <td>{item.wtr.dataSbaTarget}</td>
                </tr>
                <tr>
                  <th>sba-click</th>
                  <td>{item.sbaClick}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
      )
      detail.push(detailItem)
    }

    return detail
  }

  setMenuTabStatus (id) {
    if (id === this.state.nowTabId) {
      return 'nav-link active'
    }
    return 'nav-link'
  }

  setContentStatus (id) {
    if (id === this.state.nowTabId) {
      return 'tab-pane fade show py-4 overflowBox active'
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
    const tablePC = this.setTable('PC')
    const detailPC = this.setDetail('PC')
    const badgeSP = this.setBadges('SP')
    const tableSP = this.setTable('SP')
    const detailSP = this.setDetail('SP')

    /* 描写 */
    return (
      <div className="card">
          <div className="card-header" id={`${this.props.attrHead}-pageCheck-wtrCtr-head`}>
            <h5 className="mb-0 d-flex">
              <button className="btn text-secondary col-3 text-left collapsed" type="button" data-toggle="collapse"
                data-target={`#${this.props.attrHead}-pageCheck-wtrCtr-collapse`} aria-expanded="false"
                aria-controls={`${this.props.attrHead}-pageCheck-wtrCtr-collapse`}
                disabled={disabled}
                onClick={onShowContent} >
                WTR &amp; CTR Check
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
          <div id={`${this.props.attrHead}-pageCheck-wtrCtr-collapse`} className="collapse"
            aria-labelledby={`${this.props.attrHead}-pageCheck-wtrCtr-head`} data-parent="#project-pageCheck">
            <div className="card-body">
              <h6>WTR &amp; CTR Check</h6>
              <ul className="nav nav-tabs mt-4" id={`${this.props.attrHead}-pageCheck-wtrCtr`} role="tablist">
                <li className="nav-item">
                  <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-wtrCtr-pc-detail-tab`)}
                    id={`${this.props.attrHead}-pageCheck-wtrCtr-pc-detail-tab`}
                    data-toggle="tab"
                    href={`#${this.props.attrHead}-pageCheck-wtrCtr-pc-detail`}
                    role="tab"
                    aria-controls={`${this.props.attrHead}-pageCheck-wtrCtr-pc-detail`}
                    aria-selected="true"
                    onClick={doChangeNowTab} >PC page
                    detail</a>
                </li>
                <li className="nav-item">
                  <a className={setMenuTabStatus(`${this.props.attrHead}-pageCheck-wtrCtr-sp-detail-tab`)}
                    id={`${this.props.attrHead}-pageCheck-wtrCtr-sp-detail-tab`}
                    data-toggle="tab"
                    href={`#${this.props.attrHead}-pageCheck-wtrCtr-sp-detail`}
                    role="tab"
                    aria-controls={`${this.props.attrHead}-pageCheck-wtrCtr-sp-detail`}
                    aria-selected="true"
                    onClick={doChangeNowTab} >SP page
                    detail</a>
                </li>
              </ul>
              <div className="tab-content" id="pageTabContent">
                <div className={setContentStatus(`${this.props.attrHead}-pageCheck-wtrCtr-pc-detail-tab`)}
                  id={`${this.props.attrHead}-pageCheck-wtrCtr-pc-detail`}
                  role="tabpanel"
                  aria-labelledby={`${this.props.attrHead}-pageCheck-wtrCtr-pc-detail-tab`}>
                    {tablePC}
                    {detailPC}
                </div>
                <div className={setContentStatus(`${this.props.attrHead}-pageCheck-wtrCtr-sp-detail-tab`)}
                  id={`${this.props.attrHead}-pageCheck-wtrCtr-sp-detail`}
                  role="tabpanel"
                  aria-labelledby={`${this.props.attrHead}-pageCheck-wtrCtr-sp-detail-tab`}>
                    {tableSP}
                    {detailSP}
                </div>
              </div>
              <div className="mt-5 form-group d-flex justify-content-start align-items-center">
                <div className="col-3 mx-auto">
                  <button
                  type="button"
                  className="btn btn-outline-secondary col-12"
                  data-target={`#${this.props.attrHead}-pageCheck-wtrCtr-collapse`}
                  aria-controls={`${this.props.attrHead}-pageCheck-wtrCtr-collapse`}
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
WTRandCTRCheckResponsive.propTypes = {
  attrHead: PropTypes.string,
  status: PropTypes.string,
  result: PropTypes.object,
  url: PropTypes.string
}
