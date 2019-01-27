"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_event_1 = require("./app-event");
const event_names_enum_1 = require("../enum/event-names-enum");
const _ = require("lodash");
/**
 * EventsManager
 */
class EventsManager {
    constructor(events) {
        console.log('EventsManager: ', 'constructor');
        this.checkingForUpdate = this.makeAppEvent(events, event_names_enum_1.EventNamesEnum.CheckingForUpdate);
        this.updateNotAvailable = this.makeAppEvent(events, event_names_enum_1.EventNamesEnum.UpdateNotAvailable);
        this.updateAvailable = this.makeAppEvent(events, event_names_enum_1.EventNamesEnum.UpdateAvailable);
        this.updateDownloaded = this.makeAppEvent(events, event_names_enum_1.EventNamesEnum.UpdateDownload);
        this.error = this.makeAppEvent(events, event_names_enum_1.EventNamesEnum.Error);
    }
    makeAppEvent(events, eventName) {
        const appEvent = new app_event_1.AppEvent(eventName);
        const event = events[eventName];
        // イベントで何も処理をしない場合
        if (!event || !event.steps) {
            return appEvent;
        }
        _.forEach(event.steps, (value, index) => {
            const run = value.run;
            appEvent.add(run.name, run.command);
        });
        return appEvent;
    }
}
exports.EventsManager = EventsManager;
