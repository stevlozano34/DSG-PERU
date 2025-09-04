const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './assets/js/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ],
  devServer: {
    static: './dist',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Tu backend
        changeOrigin: true
      }
    }
  }
};