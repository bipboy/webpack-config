import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {config} from '../config';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';

const {__DEV__, __PROD__} = config.compiler_globals;

const cssModuleOptions = __PROD__
  ? {localIdentName: '[hash:base64:8]'}
  : {getLocalIdent: getCSSModuleLocalIdent};

// style files regexes
const cssRegex = /\.(sa|sc|c)ss$/;
const cssModuleRegex = /\.module\.(sa|sc|c)ss$/;

// common function to get style loaders
const getStyleLoaders = (isWeb, isModule) => {
  const dev = __DEV__;

  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        // Don't emit CSS files for SSR (previously used null-loader)
        // See https://github.com/webpack-contrib/mini-css-extract-plugin/issues/90#issuecomment-811991738
        emit: isWeb,
        esModule: isModule
      }
    },
    {
      loader: require.resolve('css-loader'),
      options: {
        sourceMap: dev,
        importLoaders: 1,
        modules: !isModule
          ? 'global'
          : {
              auto: true,
              ...cssModuleOptions,
              exportLocalsConvention: 'camelCase',
              exportOnlyLocals: !isWeb
            }
      }
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          config: false,
          plugins: [
            require.resolve('postcss-flexbugs-fixes'),
            [
              require.resolve('postcss-preset-env'),
              {
                autoprefixer: {
                  flexbox: 'no-2009'
                },
                stage: 3
              }
            ],
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            require.resolve('postcss-normalize')
          ]
        },
        sourceMap: !dev
      }
    },
    {loader: require.resolve('sass-loader'), options: {sourceMap: !dev}}
  ];

  return loaders;
};

const cssLoaderClient = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: getStyleLoaders(true, false)
};

const cssModuleLoaderClient = {
  test: cssModuleRegex,
  use: getStyleLoaders(true, true)
};

const cssLoaderServer = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: getStyleLoaders(false, false)
};

const cssModuleLoaderServer = {
  test: cssModuleRegex,
  use: getStyleLoaders(false, true)
};

export {
  cssLoaderClient,
  cssModuleLoaderClient,
  cssLoaderServer,
  cssModuleLoaderServer
};
