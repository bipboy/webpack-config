import {LoadersT, loaders} from './loaders';

import TerserPlugin from 'terser-webpack-plugin';
import {config} from './config';
import crypto from 'crypto';
import os from 'os';
import path from 'path';
import {plugins} from './plugins';
import resolvers from './resolvers';

const {__DEV__, __PROD__, __ASSET__PATH__} = config.compiler_globals;
const dir = './';

const terserOptions: any = {
  parse: {
    ecma: 8
  },
  compress: {
    ecma: 5,
    warnings: false,
    comparisons: false,
    inline: 2
  },
  mangle: {safari10: true},
  output: {
    ecma: 5,
    safari10: true,
    comments: false,
    ascii_only: true
  }
};

const isModuleCSS = (module: {type: string}): boolean => {
  return (
    module.type === `css/mini-extract` ||
    module.type === `css/extract-chunks` ||
    module.type === `css/extract-css-chunks`
  );
};

const getPackagePath = (name: string, relativeToPath: string) => {
  const packageJsonPath = require.resolve(`${name}/package.json`, {
    paths: [relativeToPath]
  });
  return path.join(packageJsonPath, '../');
};

const topLevelFrameworkPaths = [
  getPackagePath('react', dir),
  getPackagePath('react-dom', dir),
  getPackagePath('scheduler', require.resolve('react-dom', {paths: [dir]})),
  getPackagePath('object-assign', require.resolve('react', {paths: [dir]})),
  getPackagePath('object-assign', require.resolve('react-dom', {paths: [dir]}))
];

const splitChunksConfigs = {
  dev: false,
  prod: {
    chunks: (chunk) => !/^(polyfills|main)$/.test(chunk.name),
    cacheGroups: {
      framework: {
        chunks: `all`,
        name: 'framework',
        test(module) {
          const resource = module.nameForCondition && module.nameForCondition();
          if (!resource) {
            return false;
          }
          return topLevelFrameworkPaths.some((packagePath) =>
            resource.startsWith(packagePath)
          );
        },
        priority: 50,
        enforce: true
      },
      lib: {
        chunks: `all`,
        test(module: {size: Function; nameForCondition: Function}): boolean {
          return (
            module.size() > 160000 &&
            /node_modules[/\\]/.test(module.nameForCondition() || '')
          );
        },
        name(module: {
          type: string;
          libIdent?: Function;
          updateHash: (hash: crypto.Hash) => void;
        }): string {
          const hash = crypto.createHash('sha1');
          if (isModuleCSS(module)) {
            module.updateHash(hash);
          } else {
            if (!module.libIdent) {
              throw new Error(
                `Encountered unknown module type: ${module.type}. Please open an issue.`
              );
            }
            hash.update(module.libIdent({context: dir}));
          }
          return hash.digest('hex').substring(0, 8);
        },
        priority: 30,
        minChunks: 1,
        reuseExistingChunk: true
      },
      commons: {
        name: `commons`,
        minChunks: 2,
        priority: 20
      }
    },
    maxInitialRequests: 25,
    minSize: 20000
  }
};

let splitChunksConfig;
if (__DEV__) {
  splitChunksConfig = splitChunksConfigs.dev;
} else {
  splitChunksConfig = splitChunksConfigs.prod;
}

const clientBaseConfig = (opts: {loaders: LoadersT}) => {
  return {
    name: 'client',
    target: 'web',
    entry: {
      main: {
        import: './src/entry-client.tsx'
      }
    },
    output: {
      path: path.resolve('./', './client'),
      filename: __DEV__ ? '[name].js' : `[name].-[contenthash].js`,
      library: 'B_I_P_B_O_Y',
      libraryTarget: 'assign',
      chunkFilename: __DEV__ ? '[name].js' : `[name].[contenthash].js`,
      strictModuleExceptionHandling: true,
      webassemblyModuleFilename: 'wasm/[modulehash].wasm',
      hashFunction: 'xxhash64',
      hashDigestLength: 16,
      publicPath: __ASSET__PATH__
    },
    module: {
      strictExportPresence: true,
      rules: loaders(opts.loaders).client
    },
    resolve: {...resolvers.client},
    plugins: [...plugins.shared, ...plugins.client],
    optimization: {
      chunkIds: 'deterministic',
      runtimeChunk: {
        name: `webpack-runtime`
      },
      emitOnErrors: !__DEV__,
      checkWasmTypes: false,
      nodeEnv: false,
      splitChunks: splitChunksConfig,
      minimize: __PROD__,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          parallel: true,
          terserOptions
        })
      ]
    },
    devtool: config.compiler_devtool,
    stats: {
      cached: false,
      cachedAssets: false,
      chunks: false,
      chunkModules: false,
      children: false,
      colors: true,
      hash: false,
      modules: false,
      reasons: false,
      timings: true,
      version: false,
      errorDetails: true
    },
    experiments: {
      layers: true,
      cacheUnaffected: true,
      asyncWebAssembly: true
    },
    parallelism: Number(os.cpus().length - 2) || undefined
  };
};

export default clientBaseConfig;
