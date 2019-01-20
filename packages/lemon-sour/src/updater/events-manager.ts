import * as childProcess from 'child_process';

/**
 * EventsManager
 */
class EventsManager {
  constructor() {
    console.log('EventsManager: ', 'constructor');
  }

  public updateAvailable(sh: string, outputPath: string) {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        try {
          await this._bootCommand(sh, reject);
          resolve();
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  public updateDownloaded(sh: string, outputPath: string) {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        try {
          await this._bootCommand(sh, reject);
          resolve();
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  public error(sh: string, outputPath: string) {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        try {
          await this._bootCommand(sh, reject);
          resolve();
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  public checkingForUpdate(sh: string, outputPath: string) {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        try {
          await this._bootCommand(sh, reject);
          resolve();
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  public updateNotAvailable(sh: string, outputPath: string) {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        try {
          await this._bootCommand(sh, reject);
          resolve();
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  private async _bootCommand(sh: string, reject: (err: any) => void) {
    await childProcess.exec(sh, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
    });
  }
}

export { EventsManager };
