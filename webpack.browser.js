var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var CopyFilesPlugin = require('copy-webpack-plugin')
var lastCommitSHA = require('child_process').execSync('git rev-parse HEAD').toString().trim().slice(0, 5)


// This is not ideal but rather a fast solution to an anoying problem
// To be revised
var copyFiles = new CopyFilesPlugin([{
    from: '*.html',
    to: '.',
    transform: function(content, absolutePath) {
      if (process.env.NODE_ENV === 'production') {
        let contentString = content.toString()
        contentString = contentString.replace(/__RESOURCE_VERSION__/g, lastCommitSHA)
        content = new Buffer(contentString)
      }

      return content
    }
  }
])


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
    copyFiles,
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false }
    })
  ]
}
