'use strict';

const ora = require('ora');

const HEARTS_SPINNER = {
  'interval': 100,
  'frames': [
    '💛 ',
    '💙 ',
    '💜 ',
    '💚 '
  ]
};

const spinner = ora({
  spinner: HEARTS_SPINNER,
  text: 'start'
}).start();

// spinner.fail('failed');

spinner.color = 'yellow';

setTimeout(() => {
  spinner.text = 'loading...\n';
}, 1000);

setTimeout(() => {
  // beer!!
  console.log('🍺\n');
  spinner.succeed('thanks!');
}, 4000);

