/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class FormUpdateFiles extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    const iniSentData = this.initCheckState('isInit')
    this.state = {
      config: this.props.config,
      sentData: iniSentData
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

  /**
   * コンポーネントがDOMにマウント（削除）された直後
   */
  componentWillUnmount () {}

  /* ---------------------------------------------------------------------------------
   * コンポーネント内でのみ使用する関数リスト
  --------------------------------------------------------------------------------- */
  initCheckState () {
    const updateFiles = this.props.updateFiles
    if (!updateFiles) {
      return null
    }

    const sentData = {}
    const updateFilesProperties = Object.keys(updateFiles)
    for (let index = 0; index < updateFilesProperties.length; index++) {
      const updateFile = updateFilesProperties[index]
      const item = {
        checked: true,
        path: updateFiles[updateFile].path,
        resource: updateFiles[updateFile].resource
      }
      sentData[updateFile] = item
    }
    return sentData
  }

  setDisabled () {
    const sentData = this.state.sentData
    if (!sentData) {
      return true
    }

    const sentDataProperties = Object.keys(sentData)
    for (let index = 0; index < sentDataProperties.length; index++) {
      const updateFile = sentDataProperties[index]
      const checked = sentData[updateFile].checked
      if (checked === true) {
        return false
      }
    }
    return true
  }

  doChangeCheckBox (e) {
    const target = e.target
    const checked = target.checked
    const value = target.value
    const newState = this.state

    if (checked === true) {
      newState.sentData[value].checked = true
    } else {
      newState.sentData[value].checked = false
    }

    this.setState({ newState })
  }

  async doUpdataFiles () {
    this.props.onChange({
      target: this,
      value: 'load'
    })

    const sentData = this.state.sentData

    /* const result = await window.electron.updateCacheFiles(sentData) */
    await window.electron.updateCacheFiles(sentData)

    this.props.onChange({
      target: this,
      value: 'update'
    })
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const doChangeCheckBox = (e) => this.doChangeCheckBox(e)
    const doUpdataFiles = () => this.doUpdataFiles()
    const disabled = this.setDisabled()

    const updateFiles = this.state.sentData
    const checkBox = []
    if (updateFiles) {
      const updateFilesProperties = Object.keys(updateFiles)
      for (let index = 0; index < updateFilesProperties.length; index++) {
        const updateFile = updateFilesProperties[index]
        const li = (
          <div className="form-check" key={index}>
            <input className="form-check-input" type="checkbox"
              value={updateFile}
              id={`project-cacheUpdate-updataFile${index}`}
              checked={updateFiles[updateFile].checked}
              key={`i-${index}`}
              onChange={doChangeCheckBox} />
            <label className="form-check-label" htmlFor={`project-cacheUpdate-updataFile${index}`} key={`l-${index}`} >
              {updateFile}
            </label>
          </div>
        )
        checkBox.push(li)
      }
    }

    /* 描写 */
    return (
      <div>
        <h6 className="mt-5">Update files</h6>
        <p>Select the file you want to update.</p>
        <div className="bg-light border rounded mt-4 p-4">
          {checkBox}
          <div className="form-group d-flex justify-content-start align-items-center">
            <div className="mt-5 col-6 mx-auto">
              <button type="button" className="btn btn-outline-primary col-8"
                id="project-cacheUpdate-updata"
                aria-describedby="project-cacheUpdate-updata-help"
                onClick={doUpdataFiles}
                disabled={disabled} >
                  Cache parameter update
                </button>
              <small id="project-cacheUpdate-updata-help" className="form-text text-muted">Click Update Cache Parameters to
                automatically update the cache parameters for your target local environment.</small>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
FormUpdateFiles.propTypes = {
  onChange: PropTypes.func,
  updateFiles: PropTypes.object,
  config: PropTypes.object
}
