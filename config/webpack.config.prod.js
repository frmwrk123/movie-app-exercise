var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require("path");

var config = require('./webpack.config.base.js');

module.exports = webpackMerge(config, {
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, ".."),
      verbose: true
    }),
    new ExtractTextPlugin({
      filename: "css/[hash].css"
    })
  ]
});
