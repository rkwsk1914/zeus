/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'
/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class WTRandCTRCheck extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {}
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

  setTable () {
    const result = this.props.result
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

  setDetail () {
    const result = this.props.result
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

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const onShowContent = (e) => this.onShowContent(e)
    const disabled = this.setDisabled()
    const badge = this.setBadges()
    const table = this.setTable()
    const detail = this.setDetail()

    /* 描写 */
    return (
      <div className="card">
          <div className="card-header" id={`${this.props.attrHead}-pageCheck-wtrCtr-head`}>
            <h5 className="mb-0">
              <button className="btn text-secondary col-3 text-left collapsed" type="button" data-toggle="collapse"
                data-target={`#${this.props.attrHead}-pageCheck-wtrCtr-collapse`} aria-expanded="false"
                aria-controls={`${this.props.attrHead}-pageCheck-wtrCtr-collapse`}
                disabled={disabled}
                onClick={onShowContent} >
                WTR &amp; CTR Check
              </button>
              {badge}
            </h5>
          </div>
          <div id={`${this.props.attrHead}-pageCheck-wtrCtr-collapse`} className="collapse"
            aria-labelledby={`${this.props.attrHead}-pageCheck-wtrCtr-head`} data-parent="#project-pageCheck">
            <div className="card-body overflowBox">
              <h6>WTR &amp; CTR Check</h6>
              {table}
              {detail}
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
WTRandCTRCheck.propTypes = {
  attrHead: PropTypes.string,
  status: PropTypes.string,
  result: PropTypes.object
}
