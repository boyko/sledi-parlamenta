var spawn = require("child_process").spawn
var downloader = spawn('curl', ['-o','/media/projects/test.gif','http://dv.parliament.bg/DVWeb/img/homeH.gif']);
downloader.on("exit", function (code) {
    var noder  = spawn('node', ['decaptcha.js','/media/projects/test.gif']);
    noder.stdout.on("data", function (data) {
        //data = CAPTCHA
    })
})
