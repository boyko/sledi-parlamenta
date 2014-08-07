
var fs = require('fs'),
    path = require('path');

var files = ['errors'];


(function createStreams () {
    for (var i=0; i < files.length; i++) {
        var fpath = path.resolve(__dirname,'../output', files[i]);
        // !fs.existsSync(fpath) ? fs.writeFileSync(fpath, '') : fs.truncateSync(fpath, 0);
        !fs.existsSync(fpath) ? fs.writeFileSync(fpath, '') : null;

        exports[files[i]] = fs.createWriteStream(fpath, {encoding:'utf8', flags:'a'});
        exports[files[i]].on('error', function (err) {
            console.log(err);
        });
    }
}());
