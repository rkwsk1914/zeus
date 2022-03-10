const path = require('path')
const webpack = require('webpack')

const externalPliguins = new webpack.ExternalsPlugin('commonjs', [
  'app',
  'auto-updater',
  'browser-window',
  'content-tracing',
  'dialog',
  'electron',
  'global-shortcut',
  'ipc',
  'menu',
  'menu-item',
  'power-monitor',
  'protocol',
  'tray',
  'remote',
  'web-frame',
  'clipboard',
  'crash-reporter',
  'screen',
  'shell',
])

module.exports = () => {
  const MODE = 'development';
  const CONFIG = {
    mode: MODE,
    entry: {
      index: path.join(__dirname, 'src/js', 'index.js')
    },
    output: {
      path: path.join(__dirname, 'app/resources/js/'),
      filename: '[name].js'
    },
    //devtool: 'cheap-module-eval-source-map',
    target: 'node',
    module: {
      rules: [
        {
          //ローダーの処理対象ファイル
          test: /\.js$/,
          //ローダーの処理対象となるディレクトリ
          include: path.resolve(__dirname, 'src/js'),
          exclude: /node_modules/,
          //記述とは逆順に実行されるので注意！
          use: [
            {
              //利用するローダー
              loader: 'babel-loader',
              //ローダーのオプション
              options: {
                "presets": ["@babel/preset-env", "@babel/preset-react"]
              }
            },
            //ESLintによるコード解析
            {
              loader: 'eslint-loader',
              options: {
                //fix： autofixモードを有効化（できるだけ多くの問題を修復）
                fix: true,
                //ESLintによるエラー検出時にはビルドを中断
                failOnError: true,
              }
            }
          ]
        },
        {
          // 対象となるファイルの拡張子(cssのみ)
          test: /\.css$/,
          // Sassファイルの読み込みとコンパイル
          use: [
            // スタイルシートをJSからlinkタグに展開する機能
            "style-loader",
            // CSSをバンドルするための機能
            "css-loader"
          ],
        },
      ]
    },
    plugins: [
      externalPliguins
    ]
  }
  //ソースマップの設定
  if (MODE === 'development') {
    CONFIG.devtool = 'eval-source-map';
  }
  return CONFIG;
}