import axios from 'axios';
import { EnvInterface } from '../interface/env-interface';
import C from '../common/constants';

/**
 * オフライン・オンラインの判定をする関数
 * @param yml
 */
const judgmentOnLine = async (env: EnvInterface) => {
  return new Promise<boolean>(
    async (
      resolve: (value: boolean) => void,
      reject: (err: boolean) => void,
    ) => {
      // オフラインかどうかの判定
      // https://stackoverflow.com/questions/5725430/http-test-server-accepting-get-post-requests
      if (env.envName !== 'dev') {
        const response = await axios.get(C.offLineJudgmentHttpUrl);
        if (response.status !== C.HTTP_OK) {
          // offline
          reject(false);
          return;
        }

        // online
        resolve(true);
        return;
      }

      // online
      resolve(true);
      return;
    },
  );
};

export { judgmentOnLine };
