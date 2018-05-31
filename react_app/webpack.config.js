const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
});

const isEnvDev  = process.env.NODE_ENV === 'dev';
const isEnvProd = process.env.NODE_ENV === 'prod';

const sslFolder = '../../../../.deploy/prod/conf.d/ssl/';

module.exports = {
  devServer: {
    proxy: {
      "**": "localhost.jellychip.com"
    },
    disableHostCheck: true,
    port: 443,
    host: "localhost.jellychip.com",
    https: {
      cert: fs.readFileSync(`${sslFolder}bundle.crt`),
      key: fs.readFileSync(`${sslFolder}star.jellychip.com.key.pem`),
      cacert: fs.readFileSync(`${sslFolder}star_jellychip_com.crt`)
    },
  },
  cache: true,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/../Resources/public'),
    filename: 'app.js',
    publicPath: (isEnvProd ? '/bundles/api/' : '/')
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, loader: 'url-loader', options: { limit: 10000 } }
    ]
  },
  plugins: [HtmlWebpackPluginConfig]
}