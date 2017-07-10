var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")


module.exports = {
  devtool: 'cheap-module-source-map',

  entry: {
    './js/main.min.js': './js/main.js',
    './js/tokensale.min.js': './js/tokensale.js',
    './css/main.min.css': './css/main.css'
  },

  output: {
    path: path.join(__dirname),
    filename: '[name]'
  },

  module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: { loader: 'css-loader', options: { url: false, minimize: true } }
          })
        }
      ]
  },

  plugins: [
    new ExtractTextPlugin('[name]'),

    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false }
    })
  ]
}
