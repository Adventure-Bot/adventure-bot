const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        loader: require.resolve('ts-loader'),
        options: {
          compiler: 'ttypescript',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    // plugins: [new TsconfigPathsPlugin({})],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '.build-webpack'),
  },
}
