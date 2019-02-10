import * as rimraf from 'rimraf';
import razer from 'razer';

const clearDirectory = async (directoryPath: string) => {
  razer('the path where  clear directory:', directoryPath + '/*');
  return new Promise<boolean>(
    async (resolve: (value: boolean) => void, reject: (err: any) => void) => {
      // https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js
      rimraf(directoryPath + '/*', () => {
        resolve(true);
      });
    },
  );
};

export { clearDirectory };
