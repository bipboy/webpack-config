const server = {
  extensions: ['.js', '.mjs', ...['.tsx', '.ts'], '.jsx', '.json', '.wasm']
};

const client = {
  extensions: ['.mjs', '.js', ...['.tsx', '.ts'], '.jsx', '.json', '.wasm']
};

const resolvers = {
  client,
  server
};

export default resolvers;
