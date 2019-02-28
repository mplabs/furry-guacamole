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
        use: [{
          // Use current .babelrc instead of dependencies
          loader: 'babel-loader',
          options: {
            babelrc: false,
            extends: `${__dirname}/.babelrc`,
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }]
        // loader: `babel-loader?babelrc=false&extends=${__dirname}/.babelrc`
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader'
      }
    ]
  },
  devServer: {
    contentBase: ['./src', './'],
    port: 1337
  }
}
