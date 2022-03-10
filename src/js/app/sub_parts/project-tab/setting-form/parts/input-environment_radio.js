/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import { RadioItem } from './radio-Items/environment-radio-item'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class InputEnvironmentRadio extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      'Specified by directory path': false,
      'wiro-br': false,
      'wiro-tr': false,
      'pprk-br': false,
      'pprk-tr': false,
      'harrier-br': false,
      'harrier-tr': false,
      'nda-br': false,
      'nda-tr': false
    }
    this.state[this.props.value] = true
  }

  /**
   * コンポーネントがDOMにマウント（追加）された直後
   */
  componentDidMount () {
    /*
    const value = this.props.value
    const nowSelectRadio = document.getElementById(`${this.props.attrHead}-settings-environment-${value}`)
    nowSelectRadio.checked
    */
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
    const newValue = e.value

    this.props.onChange({
      target: this,
      value: newValue,
      element: 'environment'
    })
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const onChangeValue = (e) => this.onChangeValue(e)

    const properties = Object.keys(this.state)
    const radioItems = []

    for (let index = 0; index < properties.length; index++) {
      const key = properties[index]
      let checked = false
      if (key === this.props.value) {
        checked = true
      }
      radioItems.push(
        <RadioItem key={key} attrHead={this.props.attrHead} value={key} checked={checked} onChange={onChangeValue}/>
      )
    }

    /* 描写 */
    return (
      <fieldset className="form-group">
      <div className="row">
        <legend className="col-form-label col-2 pt-0"></legend>
        <div className="col-10 px-3">
          {radioItems}
        </div>
      </div>
    </fieldset>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
InputEnvironmentRadio.propTypes = {
  onChange: PropTypes.func,
  attrHead: PropTypes.string,
  value: PropTypes.string
}
