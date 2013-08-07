var DeathByCaptcha  = require('deathbycaptcha');
var Decaptcha = function(logger) {
    this.logger = logger;
    this.service = new DeathByCaptcha("your_dbc_user", "your_dbc_pass");;
}
Decaptcha.prototype = {
    logger: null,
    service: null,
    /**
     * Solve captcha by provided buffer content
     * @param image
     */
    solve: function(image) {
        var self = this;
        self.service.solve(image, function(err, id, solution) {
            if(err) {
                self.logger.error(err)
                return;
            }
            console.log(JSON.stringify({
                "solution": solution,
                "id": id
            }));
        });
    },
    /**
     * Report wrong captcha code
     * @param id
     */
    report: function(id) {
        self.service.report(id, function(err) {
            if(err) {
                self.logger.error(err)
                return;
            }
            console.log(id)
        });
    }
}

exports = module.exports = Decaptcha;