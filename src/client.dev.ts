import {LoadersT} from '.';
import clientBaseConfig from './client.base';

const clientDevConfig = (opts: {loaders: LoadersT}) => {
  return {
    ...clientBaseConfig({loaders: opts.loaders}),
    mode: 'development',
    performance: {
      hints: false
    }
  };
};

export default clientDevConfig;
