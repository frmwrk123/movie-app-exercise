const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

const config = require('./webpack.config.base.js');

module.exports = webpackMerge(config, {
  devtool: "#inline-source-map",

  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, 'dist'),
    compress: true
  },

  plugins: [
    new ExtractTextPlugin({
      filename: "css/[hash].css",
      disable: true
    })
  ]
});
