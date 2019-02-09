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

  offLineJudgmentHttpUrl: 'http://httpbin.org/get',
  HTTP_OK: 200,

  tempDirectoryName: '/temp',
};

console.log('Constants: ', Constants);

export default Constants;
