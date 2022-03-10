/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class InputPageAuth extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      username: this.props.username,
      password: this.props.password
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
  onChangePassword (e) {
    const newValue = e.target.value
    const newState = this.state
    newState.password = newValue

    this.setState({
      value: newState
    })

    this.props.onChange({
      target: this,
      value: newValue,
      element: 'password'
    })
  }

  onChangeUsername (e) {
    const newValue = e.target.value
    const newState = this.state
    newState.username = newValue

    this.setState({
      value: newState
    })

    this.props.onChange({
      target: this,
      value: newValue,
      element: 'username'
    })
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const onChangePassword = (e) => this.onChangePassword(e)
    const onChangeUsername = (e) => this.onChangeUsername(e)

    /* 描写 */
    return (
      <div className="form-group row">
      <span className="col-2 col-form-label">Page authority</span>
      <div className="col-10">
        <div className="input-group mb-3">
          <div className="input-group-prepend col-2 p-0">
            <span className="input-group-text w-100" id={`${this.props.attrHead}-addon-settings-pageAuth-username`}>user
              name</span>
          </div>
          <input type="text" className="form-control" id={`${this.props.attrHead}-settings-pageAuth-username`}
            name={`${this.props.attrHead}-settings-pageAuth-username`}
            aria-describedby={`${this.props.attrHead}-addon-settings-pageAuth-username`}
            value={this.state.username}
            disabled={this.props.disabled}
            onChange={onChangeUsername} />
        </div>
        <div className="input-group">
          <div className="input-group-prepend col-2 p-0">
            <span className="input-group-text w-100"
              id={`${this.props.attrHead}-addon-settings-pageAuth-password`}>password</span>
          </div>
          <input type="text" className="form-control" id={`${this.props.attrHead}-settings-pageAuth-password`}
            name={`${this.props.attrHead}-settings-pageAuth-password`}
            aria-describedby={`${this.props.attrHead}-addon-settings-pageAuth-password`}
            value={this.state.password}
            disabled={this.props.disabled}
            onChange={onChangePassword} />
        </div>
      </div>
    </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
InputPageAuth.propTypes = {
  onChange: PropTypes.func,
  attrHead: PropTypes.string,
  username: PropTypes.string,
  password: PropTypes.string,
  disabled: PropTypes.bool
}
