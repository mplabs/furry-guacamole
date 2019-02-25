const webpack = require('webpack')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: [
    // 'webpack-hot-middleware/client?http://localhost:1337',
    `${__dirname}/src/main.js`
  ],
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/dist`,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        // Use current .babelrc instead of dependencies
        loader: `babel-loader?babelrc=false&extends=${__dirname}/.babelrc`
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  devServer: {
    contentBase: ['./src', './'],
    port: 1337
  }
}
