/* React */
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

/* ---------------------------------------------------------------------------------
  コンポーネント
--------------------------------------------------------------------------------- */
export class ResourceFileList extends Component {
  /**
   *オブジェクトの生成
   * @param {*メインコンポーネントから受け取ったデータ} props
   */
  constructor (props) {
    super(props)
    this.state = {}
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
  setList () {
    const resourceFiles = this.props.resourceFiles

    if (!resourceFiles) {
      return (
        <div className="alert alert-warning" role="alert">
          No resource files need to be updated in the cache.
        </div>
      )
    }

    const list = []
    for (let index = 0; index < resourceFiles.length; index++) {
      const resourceFile = resourceFiles[index]
      const li = React.Children.toArray(
        <li className="list-group-item list-group-item-action text-success" key={resourceFile.path}>
        {resourceFile.path}</li>
      )
      list.push(li)
    }
    return list
  }

  /**
   * ページ描写
   */
  render () {
    /* タグに登録するイベント関数を設定 */
    const list = this.setList()

    /* 描写 */
    return (
      <div>
        <h6 className="mt-5">Resource files that need to be updated with cache parameters</h6>
        <ul className="list-group list-group-flush col-10 mx-auto mt-3">
          {list}
        </ul>
      </div>
    )
  }
}

/**
 * コンポーネントが受け取るプロパティのバリデーション
 */
ResourceFileList.propTypes = {
  resourceFiles: PropTypes.array
}
