import mapValues from 'lodash/mapValues';
import path from 'path';

// ------------------------------------
// Environment vars
// ------------------------------------

const env = process.env.NODE_ENV || 'development';

const __DEV__ = env === 'development' || env === 'localhost';
const __PROD__ = env === 'production';
const __ASSET__PATH__ = process.env.ASSET_PATH;

const envConfig = {
  env,

  // ----------------------------------
  // Path Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '..'),
  dir_build: 'scripts'
};

// ------------------------------------
// Paths
// ------------------------------------
const base = (...paths: string[]) =>
  path.resolve(envConfig.path_base, ...paths);
const fromBase =
  (...paths: string[]) =>
  (...subPaths: string[]) =>
    base(...paths, ...subPaths);

const tempPaths = {
  build: fromBase(envConfig.dir_build),
  withRootAt:
    (root: string, ...subpaths: string[]) =>
    (...args: string[]) =>
      path.resolve(root, ...subpaths, ...args)
};

const paths: typeof tempPaths & {
  base: typeof base;
  posix: typeof tempPaths;
} = {
  base,
  ...tempPaths,
  // all the sibling values, but with forward slashes regardless the OS
  posix: mapValues(
    tempPaths,
    (func: (...args: string[]) => string) =>
      (...args: string[]) =>
        func(...args).replace(/\\/g, '/')
  ) as any
};

const config = {
  ...envConfig,
  paths,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_devtool: __DEV__ && 'inline-source-map',
  compiler_mode: __DEV__ ? 'development' : 'production',
  compiler_globals: {
    __DEV__,
    __PROD__,
    __ASSET__PATH__,
    global: {},
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    }
  },
  compiler_hash_type: __PROD__ ? 'chunkhash' : 'hash'
};

export {config};
