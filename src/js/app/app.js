/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

// import { Config } from './data.js'

import { ConfigTab } from './sub_parts/config-tab.js'
import { ProjectTab } from './sub_parts/project-tab/main-parts.js'

export class Application extends Component {
  constructor (props) {
    console.log('props', props)
    super(props)
    this.state = {
      config: {
        svn: {
          username: props.jsonData.config.svn.username,
          password: props.jsonData.config.svn.password
        },
        vm: props.jsonData.config.vm
      },
      project: props.jsonData.project,
      nowTabId: 'home-tab'
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
  componentDidUpdate () {

  }

  /* ---------------------------------------------------------------------------------
   * コンポーネント内でのみ使用する関数リスト
  --------------------------------------------------------------------------------- */
  async addProject (e) {
    /* 現在開いているタブを閉じる */
    const element = document.getElementById(this.state.nowTabId)
    element.setAttribute('class', '')

    /* プロジェクトタブ追加 */
    let projectData
    if (this.state.project) {
      projectData = Array.from(this.state.project)
    } else {
      projectData = []
    }

    const newId = projectData.length + 1
    const newProject = {
      id: newId,
      settings: {
        id: newId,
        title: `Project${newId}`,
        backlog: '',
        pageData: {
          url: '',
          username: '',
          password: ''
        },
        pageSource: '',
        environmentPath: '',
        environment: ''
      }
    }
    projectData.push(newProject)
    this.setState({
      project: projectData,
      nowTabId: `project${newId}-tab`
    })

    const result = await window.electron.saveProject(projectData)
    console.log('saveProject', result)
  }

  async delProject (e) {
    const target = e.target

    /* 左隣のタブを取得 */
    const nowTab = document.getElementById(this.state.nowTabId)
    const nowLi = nowTab.parentNode
    const preLi = nowLi.previousElementSibling
    const newTab = preLi.firstElementChild
    const newTabId = newTab.getAttribute('id')

    /* 消すプロジェクトのIDを取得 */
    const id = Number(target.getAttribute('data-project-id'))
    const projectData = Array.from(this.state.project)

    /* 削除確認 */
    const answer = window.confirm('Delete the project data.\nIt\'s irreversible, but is that okay?')
    if (answer === false) {
      return
    }

    const newProjectData = projectData.filter(function (item) {
      return item.id !== id
    })

    this.setState({
      project: newProjectData,
      nowTabId: newTabId
    })

    const result = await window.electron.saveProject(newProjectData)
    console.log('saveProject', result)
  }

  async getNewConfigData (e) {
    const newValue = e.value
    const newState = this.state
    newState.config.svn.username = newValue.svn.username
    newState.config.svn.password = newValue.svn.password
    newState.config.vm = newValue.vm

    this.setState({ newState })

    const result = await window.electron.saveConfig(newValue)
    console.log('saveConfig', result)
  }

  async getNewProjectData (e) {
    const newData = e.value
    const newState = this.state

    const projectData = Array.from(newState.project)
    for (let index = 0; index < projectData.length; index++) {
      if (projectData[index].id === newData.id) {
        projectData[index].settings.title = newData.settings.title
        projectData[index].settings.backlog = newData.settings.backlog
        projectData[index].settings.pageData.url = newData.settings.pageData.url
        projectData[index].settings.pageData.username = newData.settings.pageData.username
        projectData[index].settings.pageData.password = newData.settings.pageData.password
        projectData[index].settings.pageSource = newData.settings.pageSource
        projectData[index].settings.environmentPath = newData.settings.environmentPath
        projectData[index].settings.environment = newData.settings.environment
      }
    }
    newState.project = projectData
    this.setState({ newState })

    const result = await window.electron.saveProject(projectData)
    console.log('saveProject', result)
  }

  doChangeNowTab (e) {
    e.preventDefault()
    if (!e.target.id) {
      return
    }
    this.setState({
      nowTabId: e.target.id
    })
  }

  setMenuTabStatus (id) {
    if (id === this.state.nowTabId) {
      return 'nav-link app-menu active'
    }
    return 'nav-link app-menu'
  }

  setContentStatus (id) {
    if (id === this.state.nowTabId) {
      return 'tab-pane app-content fade p-4 show active'
    }
    return 'tab-pane app-content fade p-4'
  }

  render () {
    const addProject = (e) => this.addProject(e)
    const delProject = (id) => this.delProject(id)
    const getNewConfigData = (e) => this.getNewConfigData(e)
    const getNewProjectData = (e) => this.getNewProjectData(e)
    const doChangeNowTab = (e) => this.doChangeNowTab(e)
    const setMenuTabStatus = (id) => this.setMenuTabStatus(id)
    const setContentStatus = (id) => this.setContentStatus(id)

    console.log('render', this.state)

    const nowTabId = this.state.nowTabId
    const projectData = this.state.project
    const config = this.state.config
    const projectTabs = []
    const projectNav = []
    if (projectData) {
      for (let index = 0; index < projectData.length; index++) {
        const project = projectData[index]
        projectTabs.push(
          <ProjectTab key={project.id} projectInfo={project} config={config} nowTabId={nowTabId} onChange={getNewProjectData}/>
        )
        projectNav.push(
          <li className="nav-item" key={project.id}>
          <a className={setMenuTabStatus(`project${project.id}-tab`)} id={`project${project.id}-tab`} data-toggle="tab" href={`#project${project.id}`} role="tab" aria-controls={`project${project.id}`}
            aria-selected="false" onClick={doChangeNowTab} >
              {project.settings.title}
              <img src="resources/img/iconmonstr-x-mark-thin-240.png" alt="close" className="tab-icon--close" onClick={delProject} data-project-id={project.id}/>
          </a>
          </li>
        )
      }
    }

    return (
      <div className="container my-4">

      <ul className="nav nav-tabs" id="application" role="tablist">
        <li className="nav-item">
          <a className={setMenuTabStatus('home-tab')} id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home"
            aria-selected="true" onClick={doChangeNowTab}><img src="resources/img/iconmonstr-home-6-240.png" alt="home" className="tab-icon" />Home</a>
        </li>
        <li className="nav-item">
          <a className={setMenuTabStatus('config-tab')} id="config-tab" data-toggle="tab" href="#config" role="tab" aria-controls="config"
            aria-selected="false" onClick={doChangeNowTab}><img src="resources/img/iconmonstr-gear-11-240.png" alt="config" className="tab-icon" />Config</a>
        </li>
        {projectNav}
        <li className="nav-item app-menu">
          <button className="nav-link" type="button" id="project-add-button" onClick={addProject}>
            <img src="resources/img/iconmonstr-plus-thin-240.png" alt="add project" className="tab-icon" />
          </button>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">

        <div className={setContentStatus('home-tab')} id="home" role="tabpanel" aria-labelledby="home-tab">
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
              <h1 className="display-4">Zeus</h1>
              <p className="lead">This is a coding business support tool.</p>
            </div>
          </div>
        </div>

        <ConfigTab configData={this.state.config} nowTabId={this.state.nowTabId} onChange={getNewConfigData}/>

        { projectTabs }

      </div>
  </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
Application.propTypes = {
  jsonData: PropTypes.object
}
