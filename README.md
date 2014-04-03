# grunt-throttle #

A Grunt plugin for testing under a throttled connection.

## Overview

Add the following configuration to your Gruntfile to throttle all TCP connections to `localhost:8000` to an aggregate bandwidth of 10KB/s upstream and 100KB/s downstream:

```
    throttle: {
        default: {
            remote_port: 8000,
            local_port: 8001,
            upstream: 10*1024,
            downstream: 100*1024,
            keepalive: true
        }
    }
```

Now you can simulate a slow connection to `localhost:8000` by running `grunt throttle` and visiting `localhost:8001`.

You can add multiple stanzas like `default` above to throttle multiple destinations. Note, however, that throttling is per-destination.

## Options

The following options are available for each configuration stanza.

#### remote_host
Type: `String`
Default: `'127.0.0.1'`

The remote host to which connections are to be throttled.

#### remote_port
Type: `Integer`

The remote TCP port to which connections are to be throttled.

#### local_host
Type: `String`
Default: `'127.0.0.1'`

The local address to bind to. Set to `'0.0.0.0'` to allow incoming connections from anywhere.

#### local_port
Type: `Integer`

The local TCP port to bind to.

#### upstream
Type: `Integer`
Default: `10240`

The upstream data rate, in bytes per second.

#### downstream
Type: `Integer`
Default: `10240`

The downstream data rate, in bytes per second.

#### keepalive
Type: `Boolean`
Default: `false`

Whether this task should prevent Grunt from exiting.

## Contributing

Feel free to open an issue or send a pull request.

## License

BSD-style. See the LICENSE file.

## Author

Copyright © 2013 Tiago Quelhas. Contact me at `<tiagoq@gmail.com>`.
