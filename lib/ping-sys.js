/**
* LICENSE MIT
* (C) Daniel Zelisko
* http://github.com/danielzzz/node-ping
*
* a simple wrapper for ping
*
*/

var sys   = require('util'),
    cp = require('child_process');
    os = require('os');


function probe(addr, opts, cb) {
        var p = os.platform();
        var ls = null;

        if (typeof opts == 'function') {
            cb = opts;
            opts = {};
        }

        // Default options
        var options = {
            count:   1,
            timeout: 2
        };

        for(var item in options) {
            if (opts[item]) {
                options[item] = opts[item];
            }
        }


        if (p == 'linux') {
            //linux
            ls = cp.spawn('/bin/ping', ['-n', '-w ' + options.timeout, '-c ' + options.count, addr]);
        } else if (p.match(/^win/)) {
            //windows
            var ls = cp.spawn('C:/windows/system32/ping.exe', ['-n', options.count, '-w', options.timeout * 1000, addr]);

        } else if (p == 'darwin') {
            //mac osx
            var ls = cp.spawn('/sbin/ping', ['-n', '-t ' + options.timeout, '-c ' + options.count, addr]);
        }

        ls.on('error', function(e) {
            throw new Error('ping.probe: there was an error while executing the ping program. check the path or permissions...');
        });


        /*ls.stdout.on('data', function (data) {
          //sys.print('stdout: ' + data);
        });

        ls.stderr.on('data', function (data) {
          //sys.print('stderr: ' + data);
        });*/

        ls.on('exit', function (code) {
            var result = (code === 0 ? true : false);
            cb && cb(result);
        });
}

exports.probe = probe;
