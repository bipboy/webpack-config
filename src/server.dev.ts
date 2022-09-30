import {LoadersT} from '.';
import serverBaseConfig from './server.base';

const serverDevConfig = (opts: {loaders: LoadersT}) => {
  return {
    ...serverBaseConfig({loaders: opts.loaders}),
    mode: 'development',
    performance: {
      hints: false
    }
  };
};

export default serverDevConfig;
