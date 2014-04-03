'use strict';

var net = require('net');
var ThrottleGroup = require('stream-throttle').ThrottleGroup;

module.exports = function(grunt) {

  grunt.registerMultiTask('throttle', 'Grunt plugin for testing under a throttled connection.', function() {

    var self = this;

    var upThrottle = new ThrottleGroup({rate: self.data.upstream});
    var downThrottle = new ThrottleGroup({rate: self.data.downstream});

    var server = net.createServer({ allowHalfOpen: true }, function (local) {
      var remote = net.createConnection({
        host: self.data.remote_host,
        port: self.data.remote_port,
        allowHalfOpen: true
      });

      var localThrottle = upThrottle.throttle();
      var remoteThrottle = downThrottle.throttle();

      local.pipe(localThrottle).pipe(remote);
      remote.pipe(remoteThrottle).pipe(local);
    });

    server.listen(this.data.local_port);
  });

};
