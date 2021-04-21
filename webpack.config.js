const path = require('path');
const {ProvidePlugin} = require("webpack");

const DuplicatePackageCheckerPlugin = require('@cerner/duplicate-package-checker-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = [
  {
    target: ['webworker', 'es2020'],
    entry: {
      index: './src/index.js',
      'internal-apis': './src/internal-apis.js',
      'http': './src/http/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].umd.min.js',
      library: 'git',
      libraryTarget: 'umd',
    },
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({ parallel: true })],
    },
    resolve: {
      extensions: ['.js'],
      fallback: {
        path: require.resolve('path-browserify'),
        buffer: require.resolve("buffer-lite")
      },
    },
    plugins: [
      new DuplicatePackageCheckerPlugin({
        strict: true,
      }),
      new ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer-lite']
      })
    ],
  },
]