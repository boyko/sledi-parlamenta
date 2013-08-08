var system = require('system');
var spawn = require("child_process").spawn
var flow = require('./node_modules/q');


Decaptcha = function(tempDir) {
    this.tempDir = tempDir;
}
Decaptcha.prototype = {
    solve: function(captchaUrl) {
        var captchaReady = flow.defer();
        var filepath = tempDir+'/captcha.jpg';
        var downloader = spawn('curl', ['-o', filepath, captchaUrl]);

        downloader.on("exit", function (code) {
            system.stdout.writeLine('Type in text from: '+filepath);
            var line = system.stdin.readLine();
            captchaReady.resolve(line.trim());
        })
        return captchaReady.promise;
    }
}
exports = module.exports = Decaptcha;