var flow = require('./node_modules/q');

exports = module.exports = function(captchaUrl) {
    var captchaReady = flow.defer();
    var spawn = require("child_process").spawn
    var decaptcha = spawn('node', ['bridge.js', captchaUrl]);
    var text = '';
    decaptcha.stdout.on('data', function(data) {
        text = text + data;
    })
    decaptcha.on("exit", function () {
        captchaReady.resolve(text);
    })
    return captchaReady.promise;
}