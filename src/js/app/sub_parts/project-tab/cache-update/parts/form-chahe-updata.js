/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import { Validator } from './../../../../common-parts/validation.js'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class FormChaheUpdata extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {
      sentData: {
        backLogComment: '',
        parameter: '',
        input: null,
        enviroment: this.props.enviroment,
        svn: {
          username: this.props.svn.username,
          password: this.props.svn.password
        }
      },
      error: {
        parameter: {
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
  async doGetUpDateFiles () {
    const sentData = this.state.sentData

    this.props.onChange({
      target: this,
      value: 'load'
    })

    const result = await window.electron.getUpdateFiles(sentData)

    this.props.onChange({
      target: this,
      value: 'done',
      result: result
    })
  }

  doChangeState (e) {
    const target = e.target
    const value = target.value
    const element = target.getAttribute('data-state')
    const newState = this.state
    newState.sentData[element] = value

    let msg1 = null
    let msg2 = null

    switch (element) {
      case 'parameter':
        msg1 = this.validator.checkOnlyNumber(value)
        msg2 = this.validator.checkMinLength(value, 8)
        if (msg1 || msg2) {
          newState.error[element].isError = true
          newState.error[element].msg = msg1 + msg2
          this.setState({ newState })
          return
        }
        newState.error[element].isError = false
        newState.error[element].msg = ''
        break
      default:
        break
    }

    this.setState({ newState })
  }

  setDisabled () {
    if (
      this.state.sentData.parameter === '' ||
      this.state.sentData.input === null ||
      this.props.isEnvNo === true
    ) {
      return true
    }

    if (
      this.state.error.parameter.isError === true
    ) {
      return true
    }

    if (
      this.state.sentData.backLogComment === '' &&
      this.state.sentData.input === 'backlog'
    ) {
      return true
    }

    return false
  }

  onBlur (e) {
    const target = e.target
    const value = target.value
    const element = target.getAttribute('data-state')
    const newState = this.state

    let msg1 = null
    let msg2 = null

    switch (element) {
      case 'parameter':
        msg1 = this.validator.checkOnlyNumber(value)
        msg2 = this.validator.checkMinLength(value, 8)
        if (msg1 || msg2) {
          newState.error[element].isError = true
          newState.error[element].msg = msg1 + msg2
          this.setState({ newState })
          return
        }
        break
      default:
        break
    }
    newState.error[element].isError = false
    newState.error[element].msg = ''
    this.setState({ newState })
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
    /* タグに登録するイベント関数を設定 */
    const doGetUpDateFiles = (e) => this.doGetUpDateFiles(e)
    const doChangeState = (e) => this.doChangeState(e)
    const setFormStatus = (isError) => this.setFormStatus(isError)
    // const onBlur = (e) => this.onBlur(e)
    const disabled = this.setDisabled()

    /* 描写 */
    return (
      <div className="bg-light border rounded mt-4 p-4">
      <div className="form-group row">
        <label htmlFor={`${this.props.attrHead}-cacheUpdate-backLog-comment`}
          className="col-2 col-form-label text-success">BackLog Comment URL</label>
        <div className="col-10">
          <input type="text" className="form-control"
            id={`${this.props.attrHead}-cacheUpdate-backLog-comment`}
            name={`${this.props.attrHead}-cacheUpdate-backLog-comment`}
            data-state="backLogComment"
            onChange={doChangeState}
            placeholder="https://sbweb.backlog.jp/view/{ticketId}/#comment-XXXXX" />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor={`${this.props.attrHead}-cacheUpdate-parameter`} className="col-2 col-form-label">New cache parameter
          number</label>
        <div className="col-10">
          <input
            type="tel"
            className={`form-control ${setFormStatus(this.state.error.parameter.isError)}`}
            id={`${this.props.attrHead}-cacheUpdate-parameter`}
            name={`${this.props.attrHead}-cacheUpdate-parameter`}
            maxLength="8"
            data-state="parameter"
            placeholder="XXXXXXXXX(8-digit)"
            onChange={doChangeState} />
            <div className="invalid-feedback">{this.state.error.parameter.msg}</div>
        </div>
      </div>
      <fieldset className="form-group">
        <div className="row">
          <legend className="col-form-label col-sm-2 pt-0">Update file source</legend>
          <div className="col-sm-10 d-flex justify-content-start">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={`${this.props.attrHead}-cacheUpdate-input`}
                id={`${this.props.attrHead}-cacheUpdate-input-svn`}
                data-state="input"
                value="svn"
                onChange={doChangeState} />
              <label className="form-check-label" htmlFor={`${this.props.attrHead}-cacheUpdate-input-svn`}>
                From SVN
              </label>
            </div>
            <div className="form-check ml-3">
              <input
                className="form-check-input"
                type="radio"
                name={`${this.props.attrHead}-cacheUpdate-input`}
                id={`${this.props.attrHead}-cacheUpdate-input-backlog`}
                data-state="input"
                value="backlog"
                onChange={doChangeState} />
              <label className="form-check-label" htmlFor={`${this.props.attrHead}-cacheUpdate-input-backlog`}>
                From BackLog
              </label>
            </div>
          </div>
        </div>
      </fieldset>
      <div className="form-group d-flex justify-content-start align-items-center">
        <div className="col-6 mx-auto">
          <button
            type="button"
            className="btn btn-outline-primary col-8"
            id={`${this.props.attrHead}-cacheUpdate-start`}
            aria-describedby={`${this.props.attrHead}-cacheUpdate-start`}
            disabled={disabled}
            onClick={doGetUpDateFiles} >Start</button>
          <small id={`${this.props.attrHead}-cacheUpdate-start`} className="form-text text-muted">Gets the resource file that
            needs to be updated with cache parameters..</small>
        </div>
      </div>
    </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
FormChaheUpdata.propTypes = {
  onChange: PropTypes.func,
  attrHead: PropTypes.string,
  svn: PropTypes.object,
  isEnvNo: PropTypes.bool,
  enviroment: PropTypes.string
}
