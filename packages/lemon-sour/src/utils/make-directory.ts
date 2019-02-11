import * as mkdirp from 'mkdirp';
import razer from 'razer';

const makeDirectory = async (directoryPath: string) => {
  razer('make directory:', directoryPath);
  return new Promise<boolean>(
    async (resolve: (value: boolean) => void, reject: (err: any) => void) => {
      mkdirp(directoryPath, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve(true);
      });
    },
  );
};

export { makeDirectory };
