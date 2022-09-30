import {clientBabelLoader, serverBabelLoader} from './babel-loaders';
import {clientSWCLoader, serverSWCLoader} from './swc-loaders';
import {
  cssLoaderClient,
  cssLoaderServer,
  cssModuleLoaderClient,
  cssModuleLoaderServer
} from './css-loaders';
import {esClientLoader, esServerLoader} from './esbuild-loaders';
import {tsClientLoader, tsServerLoader} from './ts-loaders';

const assetsLoader = {
  test: /\.(png|jpe?g|gif|svg)$/,
  type: 'asset'
};

const fileLoader = {
  // Exclude `js` files to keep "css" loader working as it injects
  // its runtime that would otherwise be processed through "file" loader.
  // Also exclude `html` and `json` extensions so they get processed
  // by webpacks internal loaders.
  exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
  type: 'asset/resource'
};

const clientBabel = [
  {
    oneOf: [
      cssLoaderClient,
      cssModuleLoaderClient,
      clientBabelLoader,
      assetsLoader,
      fileLoader
    ]
  }
];

const serverBabel = [
  {
    oneOf: [
      cssModuleLoaderServer,
      cssLoaderServer,
      serverBabelLoader,
      assetsLoader,
      fileLoader
    ]
  }
];

const clientSWC = [
  {
    oneOf: [
      clientSWCLoader,
      assetsLoader,
      fileLoader,
      cssLoaderClient,
      cssModuleLoaderClient
    ]
  }
];

const serverSWC = [
  {
    oneOf: [
      serverSWCLoader,
      assetsLoader,
      fileLoader,
      cssModuleLoaderServer,
      cssLoaderServer
    ]
  }
];

const clientTS = [
  {
    oneOf: [tsClientLoader, assetsLoader, fileLoader]
  }
];

const serverTS = [
  {
    oneOf: [tsServerLoader, assetsLoader, fileLoader]
  }
];

const clientES = [
  {
    oneOf: [esClientLoader, assetsLoader, fileLoader]
  }
];

const serverES = [
  {
    oneOf: [esServerLoader, assetsLoader, fileLoader]
  }
];

export type LoadersT = {
  babel?: boolean;
  swc?: boolean;
  es?: boolean;
};

const loaders = (opts: LoadersT) => {
  const {babel, swc, es} = opts;

  if (babel) {
    return {
      client: clientBabel,
      server: serverBabel
    };
  }

  if (swc) {
    return {
      client: clientSWC,
      server: serverSWC
    };
  }

  if (es) {
    return {
      client: clientES,
      server: serverES
    };
  }

  return {
    client: clientTS,
    server: serverTS
  };
};

export default loaders;
