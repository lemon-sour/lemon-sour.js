import { Events, StepsEntity, Run } from '../interface/yml-interface';
import { AppEvent } from './app-event';
import { EventNamesEnum } from '../enum/event-names-enum';
import * as _ from 'lodash';

/**
 * EventsManager
 */
class EventsManager {
  checkingForUpdate: AppEvent;
  updateNotAvailable: AppEvent;
  updateAvailable: AppEvent;
  downloadProgress: AppEvent;
  updateDownloaded: AppEvent;
  error: AppEvent;

  constructor(events: Events) {
    console.log('EventsManager: ', 'constructor');

    this.checkingForUpdate = this.makeAppEvent(
      events,
      EventNamesEnum.CheckingForUpdate,
    );
    this.updateNotAvailable = this.makeAppEvent(
      events,
      EventNamesEnum.UpdateNotAvailable,
    );
    this.updateAvailable = this.makeAppEvent(
      events,
      EventNamesEnum.UpdateAvailable,
    );
    this.downloadProgress = this.makeAppEvent(
      events,
      EventNamesEnum.DownloadProgress,
    );
    this.updateDownloaded = this.makeAppEvent(
      events,
      EventNamesEnum.UpdateDownload,
    );
    this.error = this.makeAppEvent(events, EventNamesEnum.Error);
  }

  private makeAppEvent(events: Events, eventName: EventNamesEnum) {
    const appEvent: AppEvent = new AppEvent(eventName);
    const event = events[eventName];

    // イベントで何も処理をしない場合
    if (!event || !event.steps) {
      return appEvent;
    }

    _.forEach(event.steps, (value: StepsEntity, index) => {
      const run: Run = value.run;
      appEvent.add(run.name, run.command, run.sync);
    });

    return appEvent;
  }

  // public checkingForUpdate(sh: string, outputPath: string) {
  //   return new Promise<object>(
  //     async (resolve: (value?: object) => void, reject: (err: any) => void) => {
  //       try {
  //         await this._command(sh, reject);
  //         resolve();
  //       } catch (e) {
  //         reject(e);
  //       }
  //     },
  //   );
  // }
  //
  // public updateNotAvailable(sh: string, outputPath: string) {
  //   return new Promise<object>(
  //     async (resolve: (value?: object) => void, reject: (err: any) => void) => {
  //       try {
  //         await this._command(sh, reject);
  //         resolve();
  //       } catch (e) {
  //         reject(e);
  //       }
  //     },
  //   );
  // }
  //
  // public updateAvailable(sh: string, outputPath: string) {
  //   return new Promise<object>(
  //     async (resolve: (value?: object) => void, reject: (err: any) => void) => {
  //       try {
  //         await this._command(sh, reject);
  //         resolve();
  //       } catch (e) {
  //         reject(e);
  //       }
  //     },
  //   );
  // }
  //
  // public updateDownloaded(sh: string, outputPath: string) {
  //   return new Promise<object>(
  //     async (resolve: (value?: object) => void, reject: (err: any) => void) => {
  //       try {
  //         await this._command(sh, reject);
  //         resolve();
  //       } catch (e) {
  //         reject(e);
  //       }
  //     },
  //   );
  // }
  //
  // public error(sh: string, outputPath: string) {
  //   return new Promise<object>(
  //     async (resolve: (value?: object) => void, reject: (err: any) => void) => {
  //       try {
  //         await this._command(sh, reject);
  //         resolve();
  //       } catch (e) {
  //         reject(e);
  //       }
  //     },
  //   );
  // }
  //
  // private async _command(sh: string, reject: (err: any) => void) {
  //   await childProcess.exec(sh, (err, stdout, stderr) => {
  //     if (err) {
  //       console.log(err);
  //       reject(err);
  //       return;
  //     }
  //   });
  // }
}

export { EventsManager };
