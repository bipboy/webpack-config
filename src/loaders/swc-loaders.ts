const clientSWCLoader = {
  test: /\.(tsx|ts)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          target: 'es5',
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
            dynamicImport: true
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            react: {
              importSource: 'react',
              runtime: 'automatic',
              pragma: 'React.createElement',
              pragmaFrag: 'React.Fragment',
              throwIfNamespace: true,
              useBuiltins: true
            },
            regenerator: {
              importPath: require.resolve('regenerator-runtime')
            }
          }
        },
        module: {
          type: 'es6'
        }
      }
    }
  ]
};

const serverSWCLoader = {
  test: /\.(tsx|ts)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
            dynamicImport: true
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            react: {
              importSource: 'react',
              runtime: 'automatic',
              pragma: 'React.createElement',
              pragmaFrag: 'React.Fragment',
              throwIfNamespace: true,
              useBuiltins: true
            },
            regenerator: {
              importPath: require.resolve('regenerator-runtime')
            }
          }
        },
        env: {
          targets: {
            // Targets the current version of Node.js
            node: process.versions.node
          }
        },
        module: {
          type: 'commonjs'
        }
      }
    }
  ]
};

export {serverSWCLoader, clientSWCLoader};
