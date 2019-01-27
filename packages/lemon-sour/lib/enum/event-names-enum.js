"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * イベント名の列挙体
 */
var EventNamesEnum;
(function (EventNamesEnum) {
    EventNamesEnum["UpdateAvailable"] = "update_available";
    EventNamesEnum["UpdateDownload"] = "update_downloaded";
    EventNamesEnum["Error"] = "error";
    EventNamesEnum["CheckingForUpdate"] = "checking_for_update";
    EventNamesEnum["UpdateNotAvailable"] = "update_not_available";
    EventNamesEnum["DownloadProgress"] = "download_progress";
})(EventNamesEnum || (EventNamesEnum = {}));
exports.EventNamesEnum = EventNamesEnum;
