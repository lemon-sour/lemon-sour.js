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
  latest_json_url: string;
  is_archive: boolean;
  events?: (EventsEntity)[] | null;
}
export interface EventsEntity {
  checking_for_update?: null;
  update_not_available?: null;
  update_available?: null;
  steps?: (StepsEntity)[] | null;
  download_progress?: null;
  update_downloaded?: null;
  error?: null;
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
