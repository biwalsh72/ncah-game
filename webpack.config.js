const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production'

const extractSCSS = new ExtractTextPlugin('style.css');

const PATHS = {
  app: {
    index: path.resolve(__dirname, 'app', 'index.js'),
    room: path.resolve(__dirname, 'app', 'room.js')
  },
  build: path.resolve(__dirname, 'public', 'build'),
  node: path.resolve(__dirname, 'node_modules'),
};

const config = {
  devtool: 'eval',
  entry: {
    index: [
      PATHS.app.index
    ],
    room: [
      PATHS.app.room
    ]
  },

  output: {
    path: PATHS.build,
    filename: '[name].bundle.js',
    publicPath: 'http://localhost:8080/build/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            sourceMap: true
          }
        }
      },
      {
        test: /\.(sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true, modules: 'global', } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true, modules: true } }
        ]
      }
      
      ///...
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  },


plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    //extractSCSS,
    /*
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          autoprefixer
        ]
      }
    })
    */
  ],

  performance: {
    maxEntrypointSize: 2048000,
    maxAssetSize: 2048000
  }
};

module.exports = config;