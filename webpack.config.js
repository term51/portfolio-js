const path = require('path')
const webpack = require('webpack')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

console.log('isProd', isProd)
console.log('isDev', isDev)

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties']
      }
    }
  ]
  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
      // '@public': path.resolve(__dirname, 'src/public')
    }
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: isDev
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/public/index.html'),
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/img/icons/favicon.ico'),
          to: path.resolve(__dirname, 'dist/img/icons')
        },
        {
          from: path.resolve(__dirname, 'src/public/robots.txt'),
          to: path.resolve(__dirname, 'dist')
        },
        {
          from: path.resolve(__dirname, 'src/public/img/icons/android-chrome-144x144.png'),
          to: path.resolve(__dirname, 'dist/img/icons')
        },
        {
          from: path.resolve(__dirname, 'src/public/img/icons/apple-touch-icon.png'),
          to: path.resolve(__dirname, 'dist/img/icons')
        },
        {
          from: path.resolve(__dirname, 'src/public/img/icons/browserconfig.xml'),
          to: path.resolve(__dirname, 'dist/img/icons')
        },
        {
          from: path.resolve(__dirname, 'src/public/img/icons/favicon-16x16.png'),
          to: path.resolve(__dirname, 'dist/img/icons')
        },
        {
          from: path.resolve(__dirname, 'src/public/img/icons/favicon-32x32.png'),
          to: path.resolve(__dirname, 'dist/img/icons')
        },
        {
          from: path.resolve(__dirname, 'src/public/img/icons/mstile-150x150.png'),
          to: path.resolve(__dirname, 'dist/img/icons')
        },
        {
          from: path.resolve(__dirname, 'src/public/img/icons/safari-pinned-tab.svg'),
          to: path.resolve(__dirname, 'dist/img/icons')
        },
        {
          from: path.resolve(__dirname, 'src/public/img/icons/site.webmanifest'),
          to: path.resolve(__dirname, 'dist/img/icons')
        }
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            }
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      }
    ],
  }
}
