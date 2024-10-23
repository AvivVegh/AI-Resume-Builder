const path = require('path');

const slsw = require('serverless-webpack');
const isLocal = slsw.lib.webpack.isLocal;
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  mode: isLocal ? 'development' : 'production',
  devtool: isLocal ? 'eval' : false,
  entry: slsw.lib.entries,
  target: 'node',
  resolve: {
    extensions: ['.mjs', '.ts', '.js'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  module: {
    parser: {
      javascript: {
        reexportExportsPresence: false,
        importExportsPresence: false,
      },
    },
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                privateMethod: true,
                functionBind: true,
                exportDefaultFrom: true,
                exportNamespaceFrom: true,
                decorators: true,
                decoratorsBeforeExport: true,
                topLevelAwait: true,
              },
              target: 'es2021',
              transform: {
                decoratorMetadata: true,
              },
            },
          },
        },
      },
      {
        test: /\.sql$/i,
        type: 'asset/source',
      },
    ],
  },
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
  watchOptions: {
    ignored: /node_modules/,
  },
};
