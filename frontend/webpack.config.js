const { ModuleFederationPlugin } = require('@module-federation/enhanced');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const deps = require("./package.json").dependencies;
const path = require('path')

module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },


  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port: 3000,
    allowedHosts: 'all',
    open: true,
    historyApiFallback: true,
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  module: {
    rules: [
      {
        test: '/\.html/',
        use: ['html-loader']
      },
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
      filename: 'remoteEntry.js',
      remotes: {
        'auth': 'auth@http://localhost:3001/remoteEntry.js',
        'profile': 'profile@http://localhost:3002/remoteEntry.js',
        'card': 'card@http://localhost:3003/remoteEntry.js',
      },
      exposes: {
        './CurrentUserContext': './src/contexts/CurrentUserContext.js',
        './PopupWithForm': './src/components/PopupWithForm.js'
      },
      shared: [
        {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            eager: true,
            requiredVersion: deps['react-dom'],
          },
          'react-router-dom': {
              singleton: true,
              requiredVersion: '^5.2.0'
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
      favicon: './public/favicon.ico'
    }),
  ],
};