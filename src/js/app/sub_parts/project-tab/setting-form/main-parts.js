/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import { InputTitle } from './parts/input-title.js'
import { InputBackLogURL } from './parts/input-backlog_url.js'
import { InputPageURL } from './parts/input-page_url.js'
import { InputPageAuth } from './parts/input-page_auth.js'
import { InputPageSource } from './parts/input-page_source.js'
import { InputEnvironmentPath } from './parts/input-environment_path.js'
import { InputEnvironmentRadio } from './parts/input-environment_radio.js'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class SettingForm extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.projectInfo.id,
      attrHead: 'project' + this.props.projectInfo.id,
      show: true,
      settings: {
        id: this.props.projectInfo.id,
        title: this.props.projectInfo.settings.title,
        backlog: this.props.projectInfo.settings.backlog,
        pageData: {
          url: this.props.projectInfo.settings.pageData.url,
          username: this.props.projectInfo.settings.pageData.username,
          password: this.props.projectInfo.settings.pageData.password
        },
        pageSource: this.props.projectInfo.settings.pageSource,
        environmentPath: this.props.projectInfo.settings.environmentPath,
        environment: this.initEnvironment(this.props.projectInfo.settings.environment)
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
  initEnvironment (propsEnvironment) {
    if (propsEnvironment === '') {
      return 'Specified by directory path'
    }
    return propsEnvironment
  }

  sentChangeValue (newState) {
    this.setState({
      newState
    })

    this.props.onChange({
      target: this,
      value: newState
    })
  }

  onChangeSettings (e) {
    const newValue = e.value
    const element = e.element
    const newState = this.state
    newState.settings[element] = newValue
    this.sentChangeValue(newState)
  }

  onChangePageData (e) {
    const newValue = e.value
    const element = e.element
    const newState = this.state
    newState.settings.pageData[element] = newValue
    this.sentChangeValue(newState)
  }

  setPageDataFormDisabled () {
    const pageSource = this.state.settings.pageSource
    if (pageSource !== '') {
      return true
    }
    return false
  }

  setEnvironmentPathFormDisabled () {
    const environment = this.state.settings.environment
    if (environment !== 'Specified by directory path') {
      return true
    }
    return false
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const onChangeSettings = (e) => this.onChangeSettings(e)
    const onChangePageData = (e) => this.onChangePageData(e)
    const PageDataFormDisabled = this.setPageDataFormDisabled()
    const EnvironmentPathFormDisabled = this.setEnvironmentPathFormDisabled()

    /* 描写 */
    return (
      <div id={`${this.state.attrHead}-settings-collapse`} className="collapse" aria-labelledby={`${this.state.attrHead}-settings-head`}
      data-parent="#project-settings">
      <div className="card-body">
        <form>
          <InputTitle
            attrHead={this.state.attrHead}
            value={this.state.settings.title}
            onChange={onChangeSettings} />

          <InputBackLogURL
            attrHead={this.state.attrHead}
            value={this.state.settings.backlog}
            onChange={onChangeSettings} />

          <InputPageURL
            attrHead={this.state.attrHead}
            value={this.state.settings.pageData.url}
            disabled={PageDataFormDisabled}
            onChange={onChangePageData} />

          <InputPageAuth
            attrHead={this.state.attrHead}
            username={this.state.settings.pageData.username}
            password={this.state.settings.pageData.password}
            disabled={PageDataFormDisabled}
            onChange={onChangePageData} />

          <InputPageSource
            attrHead={this.state.attrHead}
            value={this.state.settings.pageSource}
            onChange={onChangeSettings} />

          <InputEnvironmentPath
            attrHead={this.state.attrHead}
            value={this.state.settings.environmentPath}
            disabled={EnvironmentPathFormDisabled}
            onChange={onChangeSettings} />

          <InputEnvironmentRadio
            attrHead={this.state.attrHead}
            value={this.state.settings.environment}
            onChange={onChangeSettings} />
        </form>
      </div>
    </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
SettingForm.propTypes = {
  onChange: PropTypes.func,
  projectInfo: PropTypes.object
}
