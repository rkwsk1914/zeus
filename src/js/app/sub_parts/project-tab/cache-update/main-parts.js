/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'

import { FormChaheUpdata } from './parts/form-chahe-updata.js'
import { ResourceFileList } from './parts/resource-files-list.js'
import { FormUpdateFiles } from './parts/form-update-files.js'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class CacheUpdateSection extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    const env = this.setEnviroment()
    this.state = {
      attrHead: 'project' + this.props.projectInfo.id,
      status: 'ready',
      errorMsg: '',
      config: {
        svn: {
          username: this.props.config.svn.username,
          password: this.props.config.svn.password
        },
        enviroment: env
      },
      result: {
        done: false,
        resourceFiles: null,
        updateFiles: null
      }
    }
    this.setErrorMsg('isinit')
  }

  /**
   * コンポーネントがDOMにマウント（追加）された直後
   */
  componentDidMount () {
  }

  /**
   * コンポーネントが再レンダーされされた直後
   */
  componentDidUpdate () {
    this.setErrorMsg()
  }

  /**
   * コンポーネントがDOMにマウント（削除）された直後
   */
  componentWillUnmount () {}

  /* ---------------------------------------------------------------------------------
   * コンポーネント内でのみ使用する関数リスト
  --------------------------------------------------------------------------------- */
  setEnviroment () {
    const vm = this.props.config.vm
    const envPath = this.props.projectInfo.settings.environmentPath
    const env = this.props.projectInfo.settings.environment
    if (env && env !== 'Specified by directory path') {
      const result = vm + env
      return result
    }
    return envPath
  }

  async setErrorMsg (isInit) {
    const msg = []

    /*
    const username = this.props.config.svn.username
    const password = this.props.config.svn.password

    if (username === '' || password === '') {
      msg.push(<span key={1} className="col-12" >Subversion&apos;s &quot;username&quot; and &quot;password&quot; are not set.</span>)
    }
    */

    const environment = this.setEnviroment()
    const isExist = await window.electron.directoryCheck(environment)
    if (!isExist) {
      msg.push(<span key={2} className="col-12" >Local environment directory not found. {environment}</span>)
    }

    if (isInit) {
      this.state.errorMsg = msg
      return
    }

    const newState = this.state
    newState.errorMsg = msg
    this.setState({ newState })
  }

  setDisabled () {
    const state = this.state
    if (state.errorMsg.length > 0) {
      return true
    }
    return false
  }

  setBadges () {
    const status = this.state.status
    if (status === 'load') {
      return (
        <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
        </div>
      )
    }

    const result = this.state.result
    if (!result.resourceFiles) {
      return null
    }

    const badges = []
    if (result.resourceFiles.length !== 0) {
      badges.push(
        <span key={1} className="badge badge-info">Resource file<span className="badge badge-light ml-3">{result.resourceFiles.length}</span></span>
      )
    }

    const updateFilesProperties = Object.keys(result.updateFiles)
    if (updateFilesProperties.length !== 0) {
      badges.push(
        <span key={2} className="badge badge-warning ml-3">Required files<span className="badge badge-light ml-3">{updateFilesProperties.length}</span></span>
      )
    }

    if (badges.length !== 0) {
      return badges
    }
    return null
  }

  onShowContent (e) {
    const target = e.target
    const collapseId = target.getAttribute('data-target')
    $(collapseId).slideToggle()
  }

  changeStatus (e) {
    const newState = this.state
    const newStatus = e.value
    const result = e.result
    if (result) {
      newState.result.resourceFiles = result.resourceFiles
      newState.result.updateFiles = result.updateFiles
    }

    newState.status = newStatus
    this.setState({ newState })

    if (newState.status === 'update') {
      this.showAlert('.cache-update-alert-success')
    }
  }

  showAlert (className) {
    $(className).fadeIn()
    setTimeout(() => {
      $(className).fadeOut()
    }, 5000)
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const onShowContent = (e) => this.onShowContent(e)
    const changeStatus = (e) => this.changeStatus(e)
    const badge = this.setBadges()
    const setDisabled = this.setDisabled()

    const reslutDOM = []
    if (this.state.status === 'done' || this.state.status === 'update') {
      reslutDOM.push(
        <ResourceFileList
        resourceFiles={this.state.result.resourceFiles} />
      )
      reslutDOM.push(
        <FormUpdateFiles
        updateFiles={this.state.result.updateFiles}
        config={this.props.config}
        onChange={changeStatus} />
      )
    }

    /* 描写 */
    return (
      <section className="mt-5">
        <h3>Cache parameter update</h3>
        <div className="alert alert-success alert-dismissible cache-update-alert-success" role="alert">
          <strong>The cache parameter update is complete</strong>.
        </div>
        <div className="accordion mt-3" id={`${this.state.attrHead}-cacheUpdate`}>
          <div className="card">
            <div className="card-header" id={`${this.state.attrHead}-cacheUpdate-head`}>
              <h5 className="mb-0">
                <button className="btn text-secondary col-3 text-left collapsed is-invalid" type="button" data-toggle="collapse"
                  data-target={`#${this.state.attrHead}-cacheUpdate-collapse`} aria-expanded="false"
                  aria-controls={`${this.state.attrHead}-cacheUpdate-collapse`}
                  disabled={setDisabled}
                  onClick={onShowContent} >
                  Cache parameter update
                </button>
                {badge}
                <small className="invalid-feedback font-weight-normal m-0 d-flex align-items-center flex-wrap">{this.state.errorMsg}</small>
              </h5>
            </div>
            <div id={`${this.state.attrHead}-cacheUpdate-collapse`} className="collapse" aria-labelledby={`${this.state.attrHead}-cacheUpdate-head`}
              data-parent="#project-cacheUpdate">
              <div className="card-body">
                <FormChaheUpdata
                    onChange={changeStatus}
                    attrHead={this.state.attrHead}
                    isEnvNo={setDisabled}
                    enviroment={this.state.config.enviroment}
                    svn={this.state.config.svn} />
                { reslutDOM }
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
CacheUpdateSection.propTypes = {
  onChange: PropTypes.func,
  projectInfo: PropTypes.object,
  config: PropTypes.object
}
