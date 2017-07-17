var webpack  = require('webpack')
var nunjucks = require('nunjucks')
var path     = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var CopyFilesPlugin   = require('copy-webpack-plugin')
var lastCommitSHA     = require('child_process').execSync('git rev-parse HEAD').toString().trim().slice(0, 5)


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
        },
      ]
  },

  plugins: [
    new CopyFilesPlugin([{
        from: './views/*.html', to: __dirname, flatten: true,
        transform: function(buffer, absolutePath) {
          let content = buffer.toString()

          // This might not ideal but it's a rather fast solution to compile static html files without a server
          content = nunjucks.renderString(content, {
            RESOURCE_VERSION: lastCommitSHA
          })

          return new Buffer(content)
        }
      }
    ]),

    new ExtractTextPlugin('[name]'),

    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false }
    })
  ]
}
