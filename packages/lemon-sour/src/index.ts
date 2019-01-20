import { cli } from '@lemon-sour/cli';
import { CliArgsInterface } from '@lemon-sour/cli';
import { lemonSour } from './lemon-sour';

/**
 * bootstrap
 */
try {
  const args: CliArgsInterface = cli();
  lemonSour.run(args);
} catch (e) {
  // エラー処理はここまでエスカレーションしてここだけで出力する
  console.error(e);
}
