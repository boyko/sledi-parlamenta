
require('colors');
var spawn = require('child_process').spawn;
var async = require('async'),
    cmd = require('commander');

var eu = require('./lib/index')();
var models = require('./model/models');

cmd.version('1.0.0')
    .option('-l, --list', 'Scrape projects list')
    .option('-p, --project', 'Scrape each individual project')
    .option('-t, --truncate', 'Truncate all tables')
    .option('-s, --sync', 'Sync all defined DAOs to the DB')
    .parse(process.argv);



function truncate (done) {
    if (!cmd.truncate) return done();
    async.each(['Project', 'Contractor', 'Program', 'Executors', 'Partners'], function (name, done) {
        models[name].destroy({}, {truncate:true})
            .success(function () {done()})
            .error(function (err) {console.log(err); done()});
    }, done);
}

function done (action) {
    console.log(action.cyan, 'DONE!'.rainbow);
    process.exit();
}


if (cmd.list) {
    eu.scrape.projects.all(done.bind(null,'list'));
}
else if (cmd.project) {
    eu.scrape.project.all(done.bind(null,'projects'));
}
else if (cmd.list && cmd.project) {
    async.series([
        eu.scrape.projects.all,
        eu.scrape.project.all
    ], done.bind(null,'list & projects'));
}
else if (cmd.truncate) {
    truncate(done.bind(null,'truncate'));
}
else if (cmd.sync) {
    spawn('node', ['model/models.js']).on('exit', done.bind(null,'sync'));
}
