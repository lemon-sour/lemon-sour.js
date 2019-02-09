import * as rimraf from 'rimraf';

const clearDirectory = async (directoryPath: string) => {
  console.log('clearDirectory:', directoryPath + '/*');
  return new Promise<boolean>(
    async (resolve: (value: boolean) => void, reject: (err: any) => void) => {
      // https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js
      rimraf(directoryPath + '/*', () => {
        console.log('done');
        resolve(true);
      });
    },
  );
};

export { clearDirectory };
