/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class InputBackLogURL extends Component {
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

    this.setState({
      value: newValue
    })

    this.props.onChange({
      target: this,
      value: newValue,
      element: 'backlog'
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
      <label htmlFor={`${this.props.attrHead}-settings-backlog`} className="col-2 col-form-label text-success">BackLog
        URL</label>
      <div className="col-10">
        <input type="text" className="form-control" id={`${this.props.attrHead}-settings-backlog`}
          name={`${this.props.attrHead}-settings-backlog`} placeholder="https://sbweb.backlog.jp/view/"
          value={this.props.value}
          onChange={onChangeValue} />
      </div>
    </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
InputBackLogURL.propTypes = {
  onChange: PropTypes.func,
  attrHead: PropTypes.string,
  value: PropTypes.string
}
