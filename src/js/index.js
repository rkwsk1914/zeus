import '@babel/polyfill'
import 'fetch-polyfill'

/* React */
import * as React from 'react'
import { render } from 'react-dom'
import $ from 'jquery'

import { Application } from './app/app.js'

const main = async () => {
  /*
  if (!window.electron) {
    const url = './config.json'
    fetch(url)
      .then((response) => {
        // console.log(response)
        return response.json()
      })
      .then((data) => {
        render(
          <Application jsonData={data} />,
          document.getElementById('app')
        )
      })
      .catch((error) => {
        console.log(error)
      })
    return
  }
  */
  const data = await window.electron.init()
  $('#loading').remove()
  console.log(data)
  render(
    <Application jsonData={data} />,
    document.getElementById('app')
  )
}

main()
