const path = require('path')

const DuplicatePackageCheckerPlugin = require('@cerner/duplicate-package-checker-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = [
  {
    target: ['webworker', 'es2020'],
    entry: {
      index: './src/index.js',
      'internal-apis': './src/internal-apis.js',
    },
    output: {
      path: path.resolve(__dirname),
      filename: '[name].umd.min.js',
      library: 'git',
      libraryTarget: 'global',
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
      },
    },

    plugins: [
      new DuplicatePackageCheckerPlugin({
        strict: true,
      }),
    ],
  },
]
