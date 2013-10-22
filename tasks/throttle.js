'use strict';

var net = require('net');
var Throttle = require('stream-throttle');

module.exports = function(grunt) {

  grunt.registerMultiTask('throttle', 'Grunt plugin for testing under a throttled connection.', function() {

    var self = this;

    var server = net.createServer(function (local) {
      var remote = net.createConnection({host: self.data.remote_host, port: self.data.remote_port});

      var localThrottle = new Throttle({rate: self.data.upstream});
      var remoteThrottle = new Throttle({rate: self.data.downstream});

      local.pipe(localThrottle).pipe(remote);
      remote.pipe(remoteThrottle).pipe(local);
    });

    server.listen(this.data.local_port);
  });

};
