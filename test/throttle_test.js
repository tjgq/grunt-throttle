'use strict';

var net = require('net');
var grunt = require('grunt');

var testStr = new Array(100*1024).join('0123456789');

var server;

exports.throttle = {

  setUp: function(done) {
    server = net.createServer(function(socket) {
      socket.pipe(socket);
    });
    server.listen(8001, '127.0.0.1', done);
  },

  tearDown: function(done) {
    server.close(done);
  },

  default: function(test) {
    test.expect(1);

    var socket = net.createConnection(8002, '127.0.0.1', function() {
      var recvStr = '';
      socket.end(testStr);
      socket.on('data', function(chunk) {
        recvStr += chunk.toString();
      });
      socket.on('end', function() {
        test.equal(recvStr, testStr, 'received string should equal sent string');
        test.done();
      });
    });
  }
};
