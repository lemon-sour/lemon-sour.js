import * as mv from 'mv';
import razer from 'razer';

/**
 * moveAppFile
 * @param appName
 * @param extension
 * @param tempPath
 * @param distPath
 */
const moveAppFile = (
  appName: string,
  extension: string,
  tempPath: string,
  distPath: string,
) => {
  return new Promise(
    (resolve: (value?: any) => void, reject: (err: any) => void) => {
      mv(
        tempPath + '/' + appName + '.' + extension,
        distPath + '/' + appName + '.' + extension,
        { mkdirp: true },
        (err: any) => {
          if (err) {
            reject(err);
            return;
          }

          razer(
            appName,
            `Moving up the ${tempPath} file to the ${distPath} directory`,
          );
          resolve();
        },
      );
    },
  );
};

export { moveAppFile };
