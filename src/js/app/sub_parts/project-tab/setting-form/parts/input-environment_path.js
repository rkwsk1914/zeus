/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import { Validator } from './../../../../common-parts/validation.js'
/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class InputEnvironmentPath extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {}
    this.validator = new Validator()
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
  onChangeValue (e) {
    const newValue = e.target.value

    this.props.onChange({
      target: this,
      value: newValue,
      element: 'environmentPath'
    })
  }

  onBlur (e) {
    const target = e.target
    const value = target.value
    const newValue = this.validator.clearnPathString(value)

    this.props.onChange({
      target: this,
      value: newValue,
      element: 'environmentPath'
    })
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const onChangeValue = (e) => this.onChangeValue(e)
    const onBlur = (e) => this.onBlur(e)

    /* 描写 */
    return (
      <div className="form-group row align-items-center">
      <label htmlFor={`${this.props.attrHead}-settings-environmentPath`} className="col-2 col-form-label">Local
        environment</label>
      <div className="col-10">
        <input type="email" className="form-control" id={`${this.props.attrHead}-settings-environmentPath`}
          name={`${this.props.attrHead}-settings-environmentPath`} placeholder="C:\previewBox\m2-dev.local\wiro-br"
          aria-describedby={`${this.props.attrHead}-settings-environmentPath-help`}
          value={this.props.value}
          onChange={onChangeValue}
          onBlur={onBlur}
          disabled={this.props.disabled} />
        <small id={`${this.props.attrHead}-settings-environmentPath-help`} className="form-text text-muted">If you specify
          the directory path of the
          local development environment in the text box, this will be set preferentially.</small>
      </div>
    </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
InputEnvironmentPath.propTypes = {
  onChange: PropTypes.func,
  attrHead: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool
}
