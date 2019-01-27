'use strict'

// https://qiita.com/niusounds/items/0b042ee83c751643bf86

const crypto = require('crypto');
const fs = require('fs');
const shasum = crypto.createHash('sha1');

const app_a = __dirname + '/../example/app_basic_no_archive/index.txt';
fs.readFile(app_a, (err, data) => {
  shasum.update(data);
  console.log(app_a, shasum.digest('hex'));
});
