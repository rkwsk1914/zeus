/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import { FormCheckPage } from './parts/form-check-page.js'
import { HtmlValidation } from './parts/sigle/html-validation.js'
import { AltCheck } from './parts/sigle/alt-check.js'
import { WTRandCTRCheck } from './parts/sigle/wtr-ctr-check.js'
// import { HtmlValidationSelenium } from './parts/html-validation-selenium.js'
import { HtmlValidationResponsive } from './parts/responsive/html-validation.js'
import { AltCheckResponsive } from './parts/responsive/alt-check.js'
import { WTRandCTRCheckResponsive } from './parts/responsive/wtr-ctr-check.js'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class CheckPageSection extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      attrHead: 'project' + this.props.projectInfo.id,
      status: 'ready',
      result: {
        htmlValidation: {
          Single: null,
          PC: null,
          SP: null
        },
        altCheck: {
          Single: null,
          PC: null,
          SP: null
        },
        wtrCtrCheck: {
          Single: null,
          PC: null,
          SP: null
        }
      }
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
  setPageDataFormDisabled () {
    const settings = this.props.projectInfo.settings
    if (settings.pageData.url === '' && settings.pageSource === '') {
      return true
    }
    return false
  }

  changeStatus (e) {
    const newStatus = e.value
    const result = e.result
    if (result) {
      this.setState({
        status: newStatus,
        result: {
          htmlValidation: {
            Single: result.htmlValidation.Single,
            PC: result.htmlValidation.PC,
            SP: result.htmlValidation.SP
          },
          altCheck: {
            Single: result.altCheck.Single,
            PC: result.altCheck.PC,
            SP: result.altCheck.SP
          },
          wtrCtrCheck: {
            Single: result.wtrCtrCheck.Single,
            PC: result.wtrCtrCheck.PC,
            SP: result.wtrCtrCheck.SP
          }
        }
      })
      return
    }

    this.setState({
      status: newStatus
    })
  }

  setHtmlValidation () {
    const result = this.state.result
    if (!result.htmlValidation.PC && !result.htmlValidation.SP) {
      return (
        <HtmlValidation
        attrHead={this.state.attrHead}
        status={this.state.status}
        result={this.state.result.htmlValidation.Single} />
      )
    }
    return (
      <HtmlValidationResponsive
      attrHead={this.state.attrHead}
      status={this.state.status}
      url={this.props.projectInfo.settings.pageData.url}
      result={this.state.result.htmlValidation} />
    )
  }

  setAltCheck () {
    const result = this.state.result
    if (!result.altCheck.PC && !result.altCheck.SP) {
      return (
        <AltCheck
        attrHead={this.state.attrHead}
        status={this.state.status}
        result={this.state.result.altCheck.Single} />
      )
    }
    return (
      <AltCheckResponsive
      attrHead={this.state.attrHead}
      status={this.state.status}
      url={this.props.projectInfo.settings.pageData.url}
      result={this.state.result.altCheck} />
    )
  }

  setWTRandCTRCheck () {
    const result = this.state.result
    if (!result.wtrCtrCheck.PC && !result.wtrCtrCheck.SP) {
      return (
        <WTRandCTRCheck
        attrHead={this.state.attrHead}
        status={this.state.status}
        result={this.state.result.wtrCtrCheck.Single} />
      )
    }
    return (
      <WTRandCTRCheckResponsive
      attrHead={this.state.attrHead}
      status={this.state.status}
      url={this.props.projectInfo.settings.pageData.url}
      result={this.state.result.wtrCtrCheck} />
    )
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const changeStatus = (e) => this.changeStatus(e)
    const formDisabled = this.setPageDataFormDisabled()
    const HTMLValidation = this.setHtmlValidation()
    const AltCheck = this.setAltCheck()
    const WTRandCTRCheck = this.setWTRandCTRCheck()

    /* 描写 */
    return (
      <section className="mt-5">
      <h3>Page Check</h3>

      <FormCheckPage
        disabled={formDisabled}
        settings={this.props.projectInfo.settings}
        attrHead={this.state.attrHead}
        onChange={changeStatus} />

      <div className="accordion mt-3" id={`${this.state.attrHead}-pageCheck`}>
        {HTMLValidation}
        {AltCheck}
        {WTRandCTRCheck}
      </div>
    </section>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
CheckPageSection.propTypes = {
  onChange: PropTypes.func,
  projectInfo: PropTypes.object
}
