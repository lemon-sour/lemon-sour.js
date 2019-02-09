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

  public add(name: string, command: string, sync: boolean) {
    this.steps.push({
      name,
      command,
      sync,
    } as RunInterface);
  }

  public exec() {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        try {
          for (let run of this.steps) {
            console.log(run.name);
            if (run.sync) {
              await this.execCommandSync(run.command);
            } else {
              await this.execCommand(run.command);
            }
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  private async execCommand(sh: string) {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        try {
          const args: string[] = this.commandArgs2Array(sh);
          const c = args.shift() || '';
          let p = childProcess.spawn(c, [...args], {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore'],
          });
          p.unref();

          setTimeout(() => {
            resolve();
          }, 1000);
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  private execCommandSync(sh: string) {
    return new Promise<object>(
      (resolve: (value?: object) => void, reject: (err: any) => void) => {
        childProcess.exec(sh, (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }

          console.log(stdout);
          resolve();
        });
      },
    );
  }

  // https://stackoverflow.com/questions/13796594/how-to-split-string-into-arguments-and-options-in-javascript
  private commandArgs2Array(text: string) {
    const re = /^"[^"]*"$/; // Check if argument is surrounded with double-quotes
    const re2 = /^([^"]|[^"].*?[^"])$/; // Check if argument is NOT surrounded with double-quotes

    let arr: string[] = [];
    let argPart: string | null = null;

    text &&
      text.split(' ').forEach(function(arg) {
        if ((re.test(arg) || re2.test(arg)) && !argPart) {
          arr.push(arg);
        } else {
          argPart = argPart ? argPart + ' ' + arg : arg;
          // If part is complete (ends with a double quote), we can add it to the array
          if (/"$/.test(argPart)) {
            arr.push(argPart);
            argPart = null;
          }
        }
      });

    return arr;
  }
}

export { AppEvent };
