/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'

import { Validator } from './../common-parts/validation.js'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class ConfigTab extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      jsonConfig: {
        svn: {
          username: this.props.configData.svn.username,
          password: this.props.configData.svn.password
        },
        vm: this.props.configData.vm
      },
      error: {
        svnUserName: {
          isError: false,
          msg: ''
        },
        svnPassWord: {
          isError: false,
          msg: ''
        },
        vm: {
          isError: false,
          msg: ''
        }
      }
    }
    this.validator = new Validator()
  }

  /**
   * コンポーネントがDOMにマウント（追加）された直後
   */
  componentDidMount () {}

  /**
   * コンポーネントがDOMにマウント（追加）された直後
   */
  componentWillUnmount () {}

  /* ---------------------------------------------------------------------------------
   * コンポーネント内でのみ使用する関数リスト
  --------------------------------------------------------------------------------- */
  onChange (e) {
    const target = e.target
    const value = target.value
    const element = target.getAttribute('data-state')
    const newState = this.state

    switch (element) {
      case 'svnUserName':
        newState.jsonConfig.svn.username = value
        break
      case 'svnPassWord':
        newState.jsonConfig.svn.password = value
        break
      case 'vm':
        newState.jsonConfig.vm = value
        break
      default:
        break
    }

    this.setState({ newState })
  }

  onBlur (e) {
    const target = e.target
    const value = target.value
    const element = target.getAttribute('data-state')
    const newState = this.state

    const msg = this.validator.checkAlphaNum(value)

    switch (element) {
      case 'svnUserName':
      case 'svnPassWord':
        if (msg) {
          newState.error[element].isError = true
          newState.error[element].msg = msg
          this.setState({ newState })
          return
        }
        break
      case 'vm':
        newState.jsonConfig.vm = this.validator.clearnPathString(value)
        break
      default:
        break
    }
    newState.error[element].isError = false
    newState.error[element].msg = ''
    this.setState({ newState })
  }

  checkFormat () {
    const svnUserName = this.state.jsonConfig.svn.username
    const svnPassWord = this.state.jsonConfig.svn.password

    const checkFormat = [
      this.validator.checkAlphaNum(svnUserName),
      this.validator.checkAlphaNum(svnPassWord)
    ]

    for (let index = 0; index < checkFormat.length; index++) {
      const check = checkFormat[index]
      if (check !== null) {
        return false
      }
    }
    return true
  }

  async onClickSave () {
    const isOK = this.checkFormat()
    if (!isOK) {
      this.showAlert('.save-alert-danger')
      return
    }

    this.props.onChange({
      target: this,
      value: this.state.jsonConfig
    })
    this.showAlert('.save-alert-success')
  }

  showAlert (className) {
    $(className).fadeIn()
    setTimeout(() => {
      $(className).fadeOut()
    }, 5000)
  }

  setContentStatus (id) {
    if (id === this.props.nowTabId) {
      return 'tab-pane app-content fade p-4 show active'
    }
    return 'tab-pane app-content fade p-4'
  }

  setFormStatus (isError) {
    if (isError) {
      return 'is-invalid'
    }
    return null
  }

  /**
   * ページ描写
   */
  render () {
    const onClickSave = () => this.onClickSave()
    const setContentStatus = (id) => this.setContentStatus(id)
    const setFormStatus = (isError) => this.setFormStatus(isError)
    const onChange = (e) => this.onChange(e)
    const onBlur = (e) => this.onBlur(e)

    /* 描写 */
    return (
      <div className={setContentStatus('config-tab')} id="config" role="tabpanel" aria-labelledby="config-tab">

        <div className="alert alert-success alert-dismissible save-alert-success" role="alert">
          <strong>Saved</strong> the configuration.
        </div>
        <div className="alert alert-danger alert-dismissible save-alert-danger" role="alert">
          There is invalid input. Unable to save configuration.
        </div>

      <form className="bg-light border rounded mt-4 p-4">
        <div className="form-group row align-items-center">
          <label htmlFor="config-vm" className="col-2 col-form-label">Local VM directory path</label>
          <div className="col-10">
            <input type="text"
              className={`form-control ${setFormStatus(this.state.error.vm.isError)}`}
              id="config-vm"
              name="config-vm"
              placeholder="C:\previewBox\m2-dev.local"
              aria-describedby="config-vm-help"
              data-state="vm"
              value={this.state.jsonConfig.vm}
              onChange={onChange}
              onBlur={onBlur} />
            <div className="invalid-feedback">{this.state.error.vm.msg}</div>
          </div>
        </div>
        <div className="form-group d-flex justify-content-start align-items-center">
          <div className="col-6 mx-auto">
            <button type="button" className="btn btn-primary col-8" id="config-save"
              aria-describedby="config-save-help" onClick={onClickSave}>save</button>
            <small id="config-save-help" className="form-text text-muted">Save settings.</small>
          </div>
        </div>
      </form>
    </div>

    )
  }
}

/*
        <div className="form-group row">
          <span className="col-2 col-form-label">SVN authority</span>
          <div className="col-10">
            <div className="input-group mb-3">
              <div className="input-group-prepend col-2 p-0">
                <span className="input-group-text w-100" id="config-addon-svn-username">user name</span>
              </div>
              <input
                type="text"
                className={`form-control ${setFormStatus(this.state.error.svnUserName.isError)}`}
                id="config-svn-username"
                name="config-svn-username"
                data-state="svnUserName"
                aria-describedby="config-addon-svn-username"
                value={this.state.jsonConfig.svn.username}
                onChange={onChange}
                onBlur={onBlur} />
                <div className="invalid-feedback">{this.state.error.svnUserName.msg}</div>
            </div>
            <div className="input-group">
              <div className="input-group-prepend col-2 p-0">
                <span className="input-group-text w-100" id="config-addon-svn-password">password</span>
              </div>
              <input
                type="text"
                className={`form-control ${setFormStatus(this.state.error.svnPassWord.isError)}`}
                id="config-svn-password"
                name="config-svn-password"
                aria-describedby="config-addon-svn-password"
                data-state="svnPassWord"
                value={this.state.jsonConfig.svn.password}
                onChange={onChange}
                onBlur={onBlur} />
                <div className="invalid-feedback">{this.state.error.svnPassWord.msg}</div>
            </div>
          </div>
        </div>

*/

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
ConfigTab.propTypes = {
  configData: PropTypes.object,
  onChange: PropTypes.func,
  nowTabId: PropTypes.string
}
