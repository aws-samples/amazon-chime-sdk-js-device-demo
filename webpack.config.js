// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/* eslint-enable */

const app = 'device';

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      template: __dirname + `/app/${app}.html`,
      filename: __dirname + `/dist/${app}.html`,
      inject: 'head',
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [new RegExp(`${app}`)]),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
  }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  entry: [`./src/index.tsx`],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${app}-bundle.js`,
    publicPath: '/',
    libraryTarget: 'var',
    library: `app_${app}`,
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    fallback: {
      fs: false,
      tls: false,
      crypto: false,
      path: false,
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx|jsx|ts)?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(svg)$/,
        type: 'asset/source',
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/': {
        target: 'http://localhost:8080',
        bypass: function(req, _res, _proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return `/${app}.html`;
          }
        },
      },
    },
    static: {
      directory: path.join(__dirname, 'dist')
    },
    devMiddleware: {
      index: `${app}.html`,
    },
    hot: true,
    host: '0.0.0.0',
    port: 3000,
    https: true,
  },
  performance: {
    hints: false,
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
};
