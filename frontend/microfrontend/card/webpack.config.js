const { ModuleFederationPlugin } = require('@module-federation/enhanced');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const deps = require("./package.json").dependencies;

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
    allowedHosts: "all",
    port: 3003,
    open: true,
    historyApiFallback: true,
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: '/\.html/',
        use: ['html-loader']
      },
      {
        test: /\.(jpg|png|gif|jpeg|ico)$/,
        loader: 'asset',
      },
      {
        test: /\.(svg)$/,
        exclude: /node_modules/,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },      
      {
        test: /\.(ts|tsx|js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'card',
      filename: 'remoteEntry.js',
      remotes: {
        'main_app': 'main_app@http://localhost:3000/remoteEntry.js',
      },
      exposes: {
        './Card': './src/components/Card.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
        'react-router-dom': {
            singleton: true,
            requiredVersion: deps['react-router-dom'],
        },

        '@material-ui/core': {
          singleton: true,
          requiredVersion: deps['@material-ui/core'],
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      filename: './index.html',
    })
  ],
};