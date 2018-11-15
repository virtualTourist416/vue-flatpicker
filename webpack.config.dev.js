'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: 'development',
  context: __dirname,
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ],
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js'
    },
    extensions: ['.js', '.json', '.vue'],
  },
  entry: './examples/index.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    publicPath: '',
    filename: "js/[name].[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader :
            {
              loader: "style-loader",
              options: {
                sourceMap: !isProduction,
              }
            },
          {
            loader: "css-loader",
            options: {
              sourceMap: !isProduction,
            }
          },
        ],
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name]-[hash].[ext]',
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          name: '[path][name]-[hash].[ext]',
        }
      }

    ]
  },
  // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimizer: [],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: false,
      template: './examples/index.html',
      minify: {
        removeComments: isProduction,
        collapseWhitespace: isProduction,
        removeAttributeQuotes: isProduction,
        minifyJS: isProduction,
        minifyCSS: isProduction,
        minifyURLs: isProduction,
      }
    }),
    new webpack.ProvidePlugin({
      Vue: ['vue/dist/vue.esm.js', 'default'],
      'window.Vue': 'vue',
    }),
    new VueLoaderPlugin(),
  ],
  // webpack-serve related configs
  serve: {
    host: 'localhost',
    port: 9000,
    open: true,
    hot: true,
    logTime: true,
    logLevel: 'info',
    clipboard: false
  },
  devtool: isProduction ? false : '#cheap-module-eval-source-map',
  performance: {
    hints: false,
  },
  stats: {
    modules: false,
  }
};

if (isProduction) {
  module.exports.plugins.push(
    new CleanWebpackPlugin(['docs']),
    new MiniCssExtractPlugin({
      filename: 'css/demo-[hash].css',
    }),
  );
  module.exports.optimization.minimizer.push(
    new UglifyJsPlugin({
      sourceMap: false,
      uglifyOptions: {
        output: {
          beautify: false
        },
        compress: {
          drop_console: true
        }
      }
    }),
  );
}

