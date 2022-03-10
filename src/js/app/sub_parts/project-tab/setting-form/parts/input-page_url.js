/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class InputPageURL extends Component {
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
  onChangeValue (e) {
    const newValue = e.target.value

    this.props.onChange({
      target: this,
      value: newValue,
      element: 'url'
    })
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const onChangeValue = (e) => this.onChangeValue(e)

    /* 描写 */
    return (
      <div className="form-group row">
      <label htmlFor={`${this.props.attrHead}-settings-pageUrl`} className="col-2 col-form-label">Page URL</label>
      <div className="col-10">
        <input type="text" className="form-control" id={`${this.props.attrHead}-settings-pageUrl`}
          name={`${this.props.attrHead}-settings-pageUrl`} placeholder="https://www.sample.jp/"
          value={this.props.value}
          onChange={onChangeValue}
          disabled={this.props.disabled} />
      </div>
    </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
InputPageURL.propTypes = {
  onChange: PropTypes.func,
  attrHead: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool
}
