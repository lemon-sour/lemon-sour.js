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
    this.checkingForUpdate = this.makeAppEvent(
      events,
      EventNamesEnum.CheckingForUpdate
    );
    this.updateNotAvailable = this.makeAppEvent(
      events,
      EventNamesEnum.UpdateNotAvailable
    );
    this.updateAvailable = this.makeAppEvent(
      events,
      EventNamesEnum.UpdateAvailable
    );
    this.downloadProgress = this.makeAppEvent(
      events,
      EventNamesEnum.DownloadProgress
    );
    this.updateDownloaded = this.makeAppEvent(
      events,
      EventNamesEnum.UpdateDownload
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
}

export { EventsManager };
