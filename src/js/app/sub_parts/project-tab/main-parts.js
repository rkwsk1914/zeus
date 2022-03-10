/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'

import { SettingForm } from './setting-form/main-parts.js'
import { CheckPageSection } from './check-page/main-parts.js'
import { CacheUpdateSection } from './cache-update/main-parts.js'
// import { DiffReportListSection } from './diff-report-list/main-parts.js'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class ProjectTab extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      attrHead: 'project' + this.props.projectInfo.id
    }
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
  setContentStatus (id) {
    if (id === this.props.nowTabId) {
      return 'tab-pane app-content fade p-4 show active'
    }
    return 'tab-pane app-content fade p-4'
  }

  getNewProjectData (e) {
    const newData = e.value

    this.props.onChange({
      target: this,
      value: newData
    })
  }

  onShowContent (e) {
    const target = e.target
    const collapseId = target.getAttribute('data-target')
    $(collapseId).slideToggle()
  }

  /**
   * ページ描写
   */
  render () {
    const setContentStatus = (id) => this.setContentStatus(id)
    const getNewProjectData = (e) => this.getNewProjectData(e)
    const onShowContent = (e) => this.onShowContent(e)

    /* 描写 */
    return (
      <div className={setContentStatus(`${this.state.attrHead}-tab`)} id={this.state.attrHead} role="tabpanel" aria-labelledby={`${this.state.attrHead}-tab`}>
      <section>
        <h2>{this.props.projectInfo.settings.title}</h2>
        <div className="accordion mt-3" id={`${this.state.attrHead}-settings`}>
          <div className="card">
            <div className="card-header bg-secondary text-white" id={`${this.state.attrHead}-settings-head`}>
              <h5 className="mb-0 d-flex">
                <button className="btn text-white flex-fill text-left" type="button" data-toggle="collapse"
                  data-target={`#${this.state.attrHead}-settings-collapse`} aria-expanded="true"
                  aria-controls={`${this.state.attrHead}-settings-collapse`}
                  onClick={onShowContent} >
                  Settings
                </button>
              </h5>
            </div>
            <SettingForm projectInfo={this.props.projectInfo} onChange={getNewProjectData} />
          </div>
        </div>
      </section>
      <CheckPageSection projectInfo={this.props.projectInfo} onChange={getNewProjectData} />
      <CacheUpdateSection projectInfo={this.props.projectInfo} config={this.props.config} onChange={getNewProjectData} />
    </div>

    )
    /*
    <DiffReportListSection projectInfo={this.props.projectInfo} onChange={getNewProjectData} />
     */
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
ProjectTab.propTypes = {
  projectInfo: PropTypes.object,
  config: PropTypes.object,
  onChange: PropTypes.func,
  nowTabId: PropTypes.string
}
