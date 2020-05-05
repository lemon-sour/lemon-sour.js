import { EnvInterface } from '../interface/env-interface';
import EnvDev from './env.dev';
import EnvProd from './env.prod';

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

let Env: EnvInterface;
if (process.env.NODE_ENV === 'prod') {
  Env = EnvProd;
} else {
  Env = EnvDev;
}

export default Env;
