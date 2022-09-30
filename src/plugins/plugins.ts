import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {NodePolyfillPlugin} from '@bipboys/webpack-polyfill-plugin';
import {StatsWriterPlugin} from '@bipboys/webpack-stats-plugin';
import {TypedCssModulesPlugin} from 'typed-css-modules-webpack-plugin';
import {config} from '../config';
import {getDefaultEnvironmentVars} from '../utils';
import path from 'path';
import webpack from 'webpack';

const {__ASSET__PATH__, __PROD__} = config.compiler_globals;

const shared = [
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.DefinePlugin(getDefaultEnvironmentVars()),
  new ForkTsCheckerWebpackPlugin({
    typescript: {configFile: 'tsconfig.json'}
  }),
  new webpack.ProgressPlugin({
    activeModules: false,
    entries: true,
    handler(percentage, message, ...args) {
      console.log(percentage, message, ...args);
    },
    modules: true,
    modulesCount: 5000,
    profile: false,
    dependencies: true,
    dependenciesCount: 10000,
    percentBy: null
  }),
  new MiniCssExtractPlugin({
    filename: __PROD__ ? '[name].[contenthash:8].css' : '[name].css',
    chunkFilename: __PROD__ ? '[name].[contenthash:8].css' : '[name].css',
    // Remove css order warnings if css imports are not sorted
    // alphabetically. See https://github.com/webpack-contrib/mini-css-extract-plugin/pull/422
    // for more reasoning
    ignoreOrder: true
  })
].filter(Boolean);

const client = [
  new CompressionPlugin({
    filename: '[path][base].gz'
  }),
  new StatsWriterPlugin({
    filename: 'stats.json',
    fields: [
      'errors',
      'warnings',
      'assets',
      'hash',
      'publicPath',
      'outputPath',
      'namedChunkGroups'
    ]
  }),
  new webpack.DefinePlugin({
    'process.env.ASSET_PATH': JSON.stringify(__ASSET__PATH__)
  }),
  new NodePolyfillPlugin(),
  new TypedCssModulesPlugin({
    globPattern: 'src/**/*.css'
  }),
  new CopyPlugin({
    patterns: [
      {from: path.resolve('./', './public'), to: path.resolve('./', './client')}
    ]
  })
  // new BundleAnalyzerPlugin()
].filter(Boolean);

const server = [
  new CaseSensitivePathsPlugin(),
  new webpack.ContextReplacementPlugin(/any-promise/)
].filter(Boolean);

const plugins = {shared, client, server};

export default plugins;
