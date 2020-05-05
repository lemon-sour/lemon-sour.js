import razer from 'razer';

/**
 * プロジェクト名
 * @type {string}
 */
const pjName: string = require('../../package.json').name;

/**
 * 定数
 */
const Constants = {
  pjName,
  INITIAL_VERSION: '0.0.0', // 一番はじめに保持するバージョン

  VALID_YML_VERSION: 1,

  HEARTS_SPINNER: {
    interval: 100,
    frames: ['💛 ', '💙 ', '💜 ', '💚 '],
  },

  offLineJudgmentHttpUrl: 'http://httpbin.org/get',
  HTTP_OK: 200,

  downloadDirectoryName: '/download',
  backupDirectoryName: '/backup',
  extractDirectoryName: '/extract',
};

razer('Constants: ', Constants);

export default Constants;
