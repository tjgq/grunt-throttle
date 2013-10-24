# grunt-throttle #

A Grunt plugin for testing under a throttled connection.

## Overview

Add the following configuration to your `Gruntfile` to throttle all connections to `localhost:8000` to an aggregate bandwidth of 10KB/s upstream and 100KB/s downstream:

```
    throttle: {
        default: {
            remote_host: 'localhost',
            remote_port: 8000,
            local_port: 8001,
            upstream: 10*1024,
            downstream: 100*1024
        }
    }
```

Now you can simulate a slow connection to `localhost:8000` by running `grunt throttle` and visiting `localhost:8001`.

You can add multiple stanzas like `default` above to throttle multiple destinations. Note, however, that throttling is per-destination.

## Contributing

Feel free to open an issue or send a pull request.

## License

BSD-style. See the LICENSE file.

## Author

Copyright © 2013 Tiago Quelhas. Contact me at `<tiagoq@gmail.com>`.
