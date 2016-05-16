var path = require('path');
var webpack = require('webpack');

config = {
  context: path.join(__dirname, 'public/js'),
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', query: { presets: ['es2015'] }, exclude: /node_modules/ },
      { test: /\.html$/, loader: 'raw', exclude: /node_modules/ },
      { test: /\.less$/, loader: 'style!css!less', exclude: /node_modules/ }
    ]
  },
  devtool: 'source-map'
};

module.exports = config;
