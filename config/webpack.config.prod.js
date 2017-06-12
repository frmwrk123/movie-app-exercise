const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require("path");

const config = require('./webpack.config.base.js');

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
