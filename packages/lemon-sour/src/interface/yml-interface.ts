/**
 * yml ファイルのインターフェイス
 * https://jvilk.com/MakeTypes/
 * http://json2ts.com/
 */
export interface YmlInterface {
  version: number;
  jobs: Jobs;
  workflows: Workflows;
}
export interface Jobs {
  // https://stackoverflow.com/questions/38260414/typescript-interface-for-objects-with-some-known-and-some-unknown-property-names
  [key: string]: InstallApp;
}
export interface InstallApp {
  name: string;
  latest_json_url: string;
  is_archive: boolean;
  output_path: string;
  events: Events;
}
export interface Events {
  checking_for_update: Steps;
  update_not_available: Steps;
  update_available: Steps;
  download_progress: Steps;
  update_downloaded: Steps;
  error: Steps;
}
export interface Steps {
  steps?: (StepsEntity)[] | null;
}
export interface StepsEntity {
  run: Run;
}
export interface Run {
  name: string;
  command: string;
}
export interface Workflows {
  main: Main;
}
export interface Main {
  jobs?: (string)[] | null;
}
