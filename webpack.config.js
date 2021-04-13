const path = require('path')

const DuplicatePackageCheckerPlugin = require('@cerner/duplicate-package-checker-webpack-plugin')

module.exports = [
  {
    target: 'webworker',
    entry: {
      index: './src/index.js',
      'internal-apis': './src/internal-apis.js',
    },
    output: {
      path: path.resolve(__dirname),
      filename: '[name].umd.min.js',
      library: 'git',
      libraryTarget: 'umd',
    },
    mode: 'production',
    plugins: [
      new DuplicatePackageCheckerPlugin({
        strict: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-transform-async-to-generator',
              ],
            },
          },
        },
      ],
    },
  },
]
