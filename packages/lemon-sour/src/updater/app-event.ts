import * as childProcess from 'child_process';
import { RunInterface } from '../interface/run-interface';

/**
 * AppEvent - 個別のイベントを管理するクラス
 */
class AppEvent {
  eventName: string;
  steps: RunInterface[];

  constructor(eventName: string) {
    console.log('AppEvent: ', 'constructor');

    this.eventName = eventName;
    this.steps = [];
  }

  public add(name: string, command: string) {
    this.steps.push({
      name,
      command,
    } as RunInterface);
  }

  public exec() {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        try {
          for (let run of this.steps) {
            console.log(run.name);
            await this.execCommand(run.command, reject);
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  private async execCommand(sh: string, reject: (err: any) => void) {
    await childProcess.exec(sh, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
    });
  }
}

export { AppEvent };
