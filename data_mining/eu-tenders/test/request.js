
var eu = require('../lib/index')();


describe('request', function () {
    it('list', function (done) {
        eu.request.post('projects', {page:1}, function (err, res, body) {
            if (err) return done(err);
            res.statusCode.should.equal(200);
            done();
        });
    });
    it('single', function (done) {
        eu.request.get('project', {id:67740}, function (err, res, body) {
            if (err) return done(err);
            res.statusCode.should.equal(200);
            done();
        });
    });
});
