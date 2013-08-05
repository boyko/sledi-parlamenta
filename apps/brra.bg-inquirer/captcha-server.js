var http = require('http');
var director = require('director');
var DeathByCaptcha  = require('deathbycaptcha');

var router = new director.http.Router();
var decaptcha = new DeathByCaptcha("your_dbc_user", "your_dbc_pass");

function solveCaptcha() {
    //@todo replace <CONTENTS OF THE IMAGE> with the actual request body
    decaptcha.solve("<CONTENTS OF THE IMAGE>", function(err, id, solution) {
        if(err) {
            this.res.writeHead(500);
            this.res.end();
            return;
        }
        this.res.writeHead(200, { 'Content-Type': 'application/json' })
        this.res.end(JSON.stringify({
            "solution": solution,
            "id": id
        }));
    });
}

function reportWrong() {
    //@todo replace <ID OF THE CAPTCHA RESPONSE> with the actual request body
    dbc.report("<ID OF THE CAPTCHA RESPONSE>", function(err) {
        if(err) {
            this.res.writeHead(500);
            this.res.end();
            return;
        }
        this.res.writeHead(200, { 'Content-Type': 'application/json' })
    });
}

router.post('/captcha', {stream: true}, solveCaptcha);
router.post('/captcha/wrong', {stream: true}, reportWrong);


var server = http.createServer(function (req, res) {
    router.dispatch(req, res, function (err) {
        if (err) {
            res.writeHead(404);
            res.end();
        }
    });
});

server.listen(3590);