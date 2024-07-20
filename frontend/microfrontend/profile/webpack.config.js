const { ModuleFederationPlugin } = require('@module-federation/enhanced');
const deps = require("./package.json").dependencies;
const path = require('path')

module.exports = {
  entry: './src/index',
  output: {
    publicPath: 'auto',
    clean: true,
  },

  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    port: 3002,
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
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
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
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'profile',
      filename: 'remoteEntry.js',
      remotes: {
        'main_app': 'main_app@http://localhost:3000/remoteEntry.js',
      },
      exposes: {
        './EditAvatarPopup': './src/components/EditAvatarPopup.js',
        './EditProfilePopup': './src/components/EditProfilePopup.js',
        './ImagePopup': './src/components/ImagePopup.js',
        './PopupWithForm': './src/components/PopupWithForm.js',
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
        '@material-ui/core': {
          singleton: true,
          requiredVersion: deps['@material-ui/core'],
        }
      }
    }),
  ],
};