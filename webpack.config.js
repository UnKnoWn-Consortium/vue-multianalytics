const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'vue-multianalytics': './src/index.js',
    'vue-multianalytics.min': './src/index.js'
  },
  output: {
    path: "/dist",
    filename: "[name].js",
    libraryTarget: 'commonjs2'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
  plugins: [

  ],
  resolve: {
    extensions: [ '.js', '.json' ]
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
