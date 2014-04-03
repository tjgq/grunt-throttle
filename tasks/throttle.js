'use strict';

var net = require('net');
var extend = require('extend');
var ThrottleGroup = require('stream-throttle').ThrottleGroup;

var defaultOptions = {
  local_host: '127.0.0.1',
  remote_host: '127.0.0.1',
  upstream: 10*1024,
  downstream: 100*1024
};

module.exports = function(grunt) {

  grunt.registerMultiTask('throttle', 'Grunt plugin for testing under a throttled connection.', function() {

    var options = extend(defaultOptions, this.data);

    var upThrottle = new ThrottleGroup({ rate: options.upstream });
    var downThrottle = new ThrottleGroup({ rate: options.downstream });

    var server = net.createServer({ allowHalfOpen: true }, function (local) {
      var remote = net.createConnection({
        host: options.remote_host,
        port: options.remote_port,
        allowHalfOpen: true
      });

      var localThrottle = upThrottle.throttle();
      var remoteThrottle = downThrottle.throttle();

      local.pipe(localThrottle).pipe(remote);
      remote.pipe(remoteThrottle).pipe(local);
    });

    server.listen(options.local_port, options.local_host);
  });

};
