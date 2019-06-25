const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = {
  app: {
    index: path.resolve(__dirname, 'app', 'index.js'),
    room: path.resolve(__dirname, 'app', 'room.js')
  },
  build: path.resolve(__dirname, 'public', 'build'),
  node: path.resolve(__dirname, 'node_modules'),
};

const config = {
  devtool: 'source-map',
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
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader?modules&importLoaders=1&localIdentName=[local]_[hash:base64:6]',
            {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [require('autoprefixer')({
                        'browsers': ['> 1%', 'last 2 versions']
                    })],
                }
            },
        ]
    }
    ]
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
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