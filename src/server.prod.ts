import {LoadersT} from '.';
import serverBaseConfig from './server.base';

const serverProdConfig = (opts: {loaders: LoadersT}) => {
  return {
    ...serverBaseConfig({loaders: opts.loaders})
  };
};

export default serverProdConfig;
