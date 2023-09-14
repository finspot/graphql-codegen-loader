const path = require('path')

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'src/index'),

  devServer: {
    historyApiFallback: true,
    hot: true,
    liveReload: false,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },

  mode: 'development',

  module: {
    rules: [
      {
        oneOf: [
          {
            exclude: /node_modules/,
            test: /\.graphql$/,
            use: [
              { loader: 'babel-loader', options: { presets: ['@babel/preset-typescript'] } },
              {
                loader: '@pretto/graphql-codegen-loader',
                options: {
                  emitFiles: true,
                  fragmentsPaths: [path.join(__dirname, 'src/common/fragments.graphql')],
                  plugins: ['typescript-react-apollo'],
                  schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
                  schemaTypesPath: path.join(__dirname, 'src/types'),
                },
              },
            ],
          },

          {
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-typescript', ['@babel/preset-react', { runtime: 'automatic' }]] },
            test: /\.(js|jsx|ts|tsx)$/,
          },

          {
            use: ['style-loader', 'css-loader', 'postcss-loader'],
            test: /\.css$/,
          },
        ],
      },
    ],
  },

  output: {
    publicPath: '/',
  },

  plugins: [
    new ReactRefreshWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: 'assets/index.html',
    }),
  ],

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
}
