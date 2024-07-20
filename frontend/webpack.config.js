const { ModuleFederationPlugin } = require('@module-federation/enhanced');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const deps = require("./package.json").dependencies;
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: 'auto',
  },


  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    port: 3000,
    static: path.join(__dirname, 'dist'),
    open: true,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(jpg|png|gif|jpeg|ico)$/,
        loader: 'asset',
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
     {

        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'main_app',
      remotes: {
        'auth': 'auth@http://localhost:3001/remoteEntry.js',
        'profile': 'profile@http://localhost:3002/remoteEntry.js',
      },
      exposes: {
        'CurrentUserContext': './src/contexts/CurrentUserContext.js'
      },
      shared: [
        {
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
          '@material-ui/core': {
            singleton: true,
            requiredVersion: deps['@material-ui/core'],
          },
        },
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      filename: './index.html',
      manifest: "./manifest.json"
    }),
  ],
};