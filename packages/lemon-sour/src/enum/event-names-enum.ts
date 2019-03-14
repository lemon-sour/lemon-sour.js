/**
 * イベント名の列挙体
 */
enum EventNamesEnum {
  UpdateAvailable = 'update_available',
  UpdateDownload = 'update_downloaded',
  Error = 'error',
  CheckingForUpdate = 'checking_for_update',
  UpdateNotAvailable = 'update_not_available',
  DownloadProgress = 'download_progress'
}

export { EventNamesEnum }
