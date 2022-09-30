import {LoadersT} from '.';
import clientBaseConfig from './client.base';

const clientProdConfig = (opts: {loaders: LoadersT}) => {
  return {
    ...clientBaseConfig({loaders: opts.loaders}),
    mode: 'production'
  };
};

export default clientProdConfig;
