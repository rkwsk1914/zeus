/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'
/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class AltCheck extends Component {
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

    if (result.errorCount === 0) {
      const badges = [
        <span key={1} className="badge badge-info">img Tags<span className="badge badge-light ml-3">{result.itemsCount}</span></span>,
        <span key={2} className="badge badge-success ml-3">All Alt OK !!</span>
      ]
      return badges
    }

    if (result.errorCount !== 0) {
      const badges = [
        <span key={3} className="badge badge-info">img Tags<span className="badge badge-light ml-3">{result.itemsCount}</span></span>,
        <span key={4} className="badge badge-danger ml-3">Error<span className="badge badge-light ml-3">{result.errorCount}</span></span>
      ]
      return badges
    }
    return null
  }

  setResult () {
    const result = this.props.result
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
      <div className="card-body overflowBox">
        <h6>ALT Check</h6>
        {alert}
        <ul className="list-group list-group-flush">
          {lists}
        </ul>
      </div>
    )
  }

  setDisabled () {
    const result = this.props.result
    if (!result) {
      return true
    }
    return false
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const onShowContent = (e) => this.onShowContent(e)
    const badge = this.setBadges()
    const result = this.setResult()
    const disabled = this.setDisabled()

    /* 描写 */
    return (
      <div className="card">
      <div className="card-header" id={`${this.props.attrHead}-pageCheck-altCheck-head`}>
        <h5 className="mb-0">
          <button className="btn text-secondary col-3 text-left collapsed" type="button" data-toggle="collapse"
            data-target={`#${this.props.attrHead}-pageCheck-altCheck-collapse`} aria-expanded="false"
            aria-controls={`${this.props.attrHead}-pageCheck-altCheck-collapse`}
            disabled={disabled}
            onClick={onShowContent} >
            ALT Check
          </button>
          {badge}
        </h5>
      </div>
      <div id={`${this.props.attrHead}-pageCheck-altCheck-collapse`} className="collapse"
        aria-labelledby={`${this.props.attrHead}-pageCheck-altCheck-head`} data-parent="#project-pageCheck">
        {result}
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
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
AltCheck.propTypes = {
  attrHead: PropTypes.string,
  status: PropTypes.string,
  result: PropTypes.object
}
