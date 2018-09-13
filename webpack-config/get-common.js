//---------//
// Imports //
//---------//

import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'

//
//------//
// Init //
//------//

const projectRootDir = path.resolve(__dirname, '..'),
  distDir = path.resolve(projectRootDir, '../dist'),
  scssDir = path.resolve(projectRootDir, './scss'),
  exportedScssRe = /\/exported\/.*\.scss$/,
  componentScssRe = /\/components\/.*\.scss$/,
  sassResourcesLoader = getSassResourcesLoader(),
  htmlPluginInstance = new HtmlPlugin({
    template: path.resolve(__dirname, '../index.tpl'),
  })

//
//------//
// Main //
//------//

//
// we take an 'environment' for cases where the code would otherwise be
//   copy/pasted or obscure
//
const getCommonConfig = ({ environment }) => ({
  context: projectRootDir,
  entry: path.resolve(projectRootDir, 'js/index.js'),
  output: {
    filename: '[name].[chunkhash].js',
    path: distDir,
    publicPath: '/',
  },
  plugins: [new FriendlyErrorsPlugin(), htmlPluginInstance],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              [
                '@babel/plugin-proposal-class-properties',
                {
                  loose: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(ttf|woff)$/,
        use: 'file-loader',
      },
      {
        test: exportedScssRe,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: componentScssRe,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              camelCase: true,
              modules: true,
            },
          },
          'sass-loader',
          sassResourcesLoader,
        ],
      },
      {
        test: /\.scss$/,
        exclude: [exportedScssRe, componentScssRe],
        use: [
          environment === 'dev' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          sassResourcesLoader,
        ],
      },
    ],
  },
})

//
//------------------//
// Helper Functions //
//------------------//

function getSassResourcesLoader() {
  return {
    loader: 'sass-resources-loader',
    options: {
      resources: [
        path.resolve(scssDir, 'variables.scss'),
        path.resolve(scssDir, 'mixins/*.scss'),
      ],
    },
  }
}

//
//---------//
// Exports //
//---------//

export default getCommonConfig
