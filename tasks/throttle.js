'use strict';

var net = require('net');
var extend = require('extend');
var ThrottleGroup = require('stream-throttle').ThrottleGroup;

var defaultOptions = {
  local_host: '127.0.0.1',
  remote_host: '127.0.0.1',
  upstream: 10*1024,
  downstream: 100*1024,
  keepalive: false,
  latency: 0
};

module.exports = function(grunt) {

  grunt.registerMultiTask('throttle', 'Grunt plugin for testing under a throttled connection.', function() {

    var options = extend(defaultOptions, this.data);

    if (typeof options.local_port === 'undefined') {
      grunt.fatal('Must specify local port');
    }

    if (typeof options.remote_port === 'undefined') {
      grunt.fatal('Must specify remote port');
    }

    var keepAlive = this.flags.keepalive || options.keepalive;

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

      remoteThrottle.pipe(local);

      remote.on('data', function(chunk) {
        setTimeout(function() {
          remoteThrottle.write(chunk);
        }, options.latency);
      });
    });

    server.listen(options.local_port, options.local_host);

    server.on('listening', function() {
      var localAddr = options.local_host + ':' + options.local_port;
      var remoteAddr = options.remote_host + ':' + options.remote_port;
      grunt.log.writeln('Throttling connections to ' + remoteAddr + ', go to ' + localAddr);
    });

    server.on('error', function(err) {
      grunt.fatal(err);
    });

    var done = this.async();
    if (!keepAlive) {
      done();
    }
  });

};
