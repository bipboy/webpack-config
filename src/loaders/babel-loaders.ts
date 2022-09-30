import {config} from '../config';

const {__PROD__} = config.compiler_globals;

const clientBabelLoader = {
  test: /\.(tsx|ts)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          [require.resolve('@bipboys/babel-preset'), {browser: true, esm: true}]
        ],
        cacheDirectory: true,
        cacheCompression: __PROD__,
        compact: __PROD__
      }
    }
  ]
};

const serverBabelLoader = {
  test: /\.(tsx|ts)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        presets: [[require.resolve('@bipboys/babel-preset')]],
        cacheDirectory: true,
        cacheCompression: __PROD__,
        compact: __PROD__
      }
    }
  ]
};

export {serverBabelLoader, clientBabelLoader};
