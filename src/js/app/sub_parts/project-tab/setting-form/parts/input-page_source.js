/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class InputPageSource extends Component {
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
      element: 'pageSource'
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
      <label htmlFor={`${this.props.attrHead}-settings-pageSource`} className="col-2 col-form-label">Example textarea</label>
      <div className="col-10">
        <textarea className="form-control" id={`${this.props.attrHead}-settings-pageSource`}
          name={`${this.props.attrHead}-settings-pageSource`} rows="7"
          onChange={onChangeValue}
          value={this.props.value}
          aria-describedby={`${this.props.attrHead}-settings-pageSource-help`}></textarea>
        <small id={`${this.props.attrHead}-settings-pageSource-help`} className="form-text text-muted">
          If you enter the HTML source code in the text box, it will be set with priority.</small>
      </div>
    </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
InputPageSource.propTypes = {
  onChange: PropTypes.func,
  attrHead: PropTypes.string,
  value: PropTypes.string
}
