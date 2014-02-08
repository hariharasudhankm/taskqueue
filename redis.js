var http = require("http");
var redis = redis || require("redis").createClient();

module.exports = redis;

