const esClientLoader = {
  test: /\.(tsx|ts)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'tsx',
        target: 'es2015'
      }
    }
  ]
};

const esServerLoader = {
  test: /\.(tsx|ts)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'tsx',
        target: 'node16'
      }
    }
  ]
};

export {esClientLoader, esServerLoader};
