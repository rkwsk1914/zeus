/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class RadioItem extends Component {
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
      value: newValue
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
      <div className="form-check">
      <input className="form-check-input" type="radio" name={`${this.props.attrHead}-settings-environment`}
        id={`${this.props.attrHead}-settings-environment-${this.props.value}`} value={this.props.value}
        onChange={onChangeValue}
        checked={this.props.checked} />
      <label className="form-check-label" htmlFor={`${this.props.attrHead}-settings-environment-${this.props.value}`}>
        {this.props.value}
      </label>
    </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
RadioItem.propTypes = {
  onChange: PropTypes.func,
  attrHead: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool
}
