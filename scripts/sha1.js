'use strict'

const crypto = require('crypto');
const fs = require('fs');
const shasum = crypto.createHash('sha1');

const app_a = __dirname + '/../example/app_a/index.txt';
fs.readFile(app_a, (err, data) => {
  shasum.update(data);
  console.log(app_a, shasum.digest('hex'));
});
