import {LoadersT, loaders} from './loaders';

import {config} from './config';
import path from 'path';
import {plugins} from './plugins';
import resolvers from './resolvers';
import webpackNodeExternals from 'webpack-node-externals';

const {__DEV__} = config.compiler_globals;

const serverBaseConfig = (opts: {loaders: LoadersT}) => {
  return {
    name: 'bundle',
    target: 'node',
    entry: './src/server.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve('./', './server'),
      chunkFilename: '[id].js',
      libraryTarget: 'commonjs2'
    },
    resolve: {...resolvers.server},
    externalsPresets: {node: true},
    externals: __DEV__
      ? webpackNodeExternals()
      : {
          sharp: 'commonjs sharp'
        },
    module: {rules: loaders(opts.loaders).server},
    plugins: [...plugins.shared, ...plugins.server],
    optimization: {
      emitOnErrors: __DEV__,
      checkWasmTypes: false,
      nodeEnv: false,
      splitChunks: false,
      minimize: false,
      minimizer: []
    },
    stats: {
      assets: false,
      cached: false,
      cachedAssets: false,
      chunks: false,
      chunkModules: false,
      children: false,
      colors: true,
      hash: false,
      modules: false,
      performance: false,
      reasons: false,
      timings: true,
      version: false
    },
    node: {
      __dirname: false,
      __filename: false
    },
    devtool: config.compiler_devtool,
    watchOptions: {
      ignored: ['**/.git/**', '**/node_modules/**']
    }
  };
};

export default serverBaseConfig;
