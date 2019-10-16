const md5 = require('md5');

exports.semVersion = '?v=1.0.1';
exports.number = '?b=12563789';
exports.hash = `?${md5(Date.now)}`;
