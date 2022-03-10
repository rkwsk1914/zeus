/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class FormCheckPage extends Component {
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
  async doSeleniumChrome () {
    const settings = this.props.settings

    this.props.onChange({
      target: this,
      value: 'load'
    })

    console.log(settings)
    const result = await window.electron.checkHtml(settings)

    this.props.onChange({
      target: this,
      value: 'ready',
      result: result
    })
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const doSeleniumChrome = (e) => this.doSeleniumChrome(e)

    /* 描写 */
    return (
      <div className="form-group d-flex justify-content-start align-items-center bg-light border rounded mt-4 p-4">
        <div className="col-3">
          <button
            type="button"
            className="btn btn-primary col-9"
            id={`${this.props.attrHead}-check-start`}
            name={`${this.props.attrHead}-check-start`}
            aria-describedby={`${this.props.attrHead}-check-start-help`}
            disabled={this.props.disabled}
            onClick={doSeleniumChrome}>Start
          </button>
          <small id={`${this.props.attrHead}-check-start-help`} className="form-text text-muted">Click &quot;Start&quot; to execute the following
            items.</small>
        </div>
      </div>
    )
  }
}

/*
        <div className="custom-control custom-switch col-7">
          <input
            type="checkbox"
            className="custom-control-input"
            id={`${this.props.attrHead}-check-wathing`}
            name={`${this.props.attrHead}-check-wathing`}
            aria-describedby={`${this.props.attrHead}-check-wathing-help`}
            disabled />
          <label className="custom-control-label" htmlFor={`${this.props.attrHead}-check-wathing`}>Wathing</label>
          <small id={`${this.props.attrHead}-check-wathing-help`} className="form-text text-muted">When turned on, the page information
            will be reloaded
            each time the file in the local environment specified in &quot;Local environment&quot; is updated.</small>
        </div>
*/

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
FormCheckPage.propTypes = {
  onChange: PropTypes.func,
  settings: PropTypes.object,
  attrHead: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool
}
