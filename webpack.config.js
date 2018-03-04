require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: {
    client: './src/client.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/build'),
    publicPath: '/build/',
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      server: path.resolve(__dirname, 'src/server'),
      components: path.resolve(__dirname, 'src/components'),
    }
  },
  module : {
    loaders : [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  path.resolve(__dirname, 'src/styles')
                ]
              }
            }
          ]
        })
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ],
  devtool: 'inline-source-map',
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new UglifyJsPlugin());
  config.devtool = undefined;
}

module.exports = config;
