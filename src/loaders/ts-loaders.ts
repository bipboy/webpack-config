const tsClientLoader = {
  test: /\.(tsx|ts)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('ts-loader'),
      options: {
        transpileOnly: true,
        configFile: 'tsconfig.client.json'
      }
    }
  ]
};

const tsServerLoader = {
  test: /\.(tsx|ts)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('ts-loader'),
      options: {
        transpileOnly: true,
        configFile: 'tsconfig.server.json'
      }
    }
  ]
};

const tsLoader = {
  test: /\.(tsx|ts)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('ts-loader'),
      options: {
        transpileOnly: true,
        configFile: 'tsconfig.json'
      }
    }
  ]
};

export {tsClientLoader, tsServerLoader, tsLoader};
