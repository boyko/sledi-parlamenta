
require('colors')
var async = require('async');

var eu = require('./index')();

var models = require('../model/models'),
    Project = models.Project,
    Contractor = models.Contractor,
    Program = models.Program,
    Executors = models.Executors,
    Partners = models.Partners;


exports.projects = {
    total: function (done) {
        eu.request.get('projects', {}, function (err, res, body) {
            if (err) return done(err);
            var result = eu.parse.projects.total(body);
            done(null, result);
        });
    },
    page: function (args, done) {
        eu.request.post('projects', args, function (err, res, body) {
            if (err) return done(err);

            var result = eu.parse.projects.page(body);

            async.each(result.projects, function (project, done) {
                Project.findOrCreate(
                    {id:project.id},
                    project
                )
                .success(function (obj, created) {done()})
                .error(function (err) {console.log(err); done()});
            }, function () {
                done(null, result.viewstate);
            });
        });
    },
    all: function (done) {
        async.waterfall([
            this.total,
            function (result, done) {
                var pages = Math.ceil(result.total/10),
                    page = 0;
                var args = {next:null, viewstate:result.viewstate};

                async.eachSeries(Array(pages), function (dummy, done) {
                    page++;

                    args.next = (page!=1) && ((page%10) == 1)
                        ? 'NextGroup'
                        : '_' + page;

                    exports.projects.page(args, function (err, viewstate) {
                        args.viewstate = viewstate;
                        if (err) {
                            eu.w.errors.write([(new Date()), 'Page ' + page,
                                err.message, '--------------------------------------'
                            ].join('\n'));
                            console.log('Page'.red, page.toString().red, '\n', err);
                            return done();
                        }
                        console.log('Page'.green, page.toString().green);
                        done();
                    });
                }, done);
            }
        ], done);
    }
};


exports.project = {
    total: function (done) {
        Project.findAll().success(function (projects) {
            done(null, projects);
        }).error(function (err) {
            console.log(err);
            done();
        });
    },
    page: function (project, done) {
        eu.request.get('project', {id:project.id}, function (err, res, body) {
            if (err) return done(err, page);
            
            var result = eu.parse.project.page(body);

            function error (err, done) {
                eu.w.errors.write([(new Date()), 'Project ' + project.id,
                    err.message, '--------------------------------------'
                ].join('\n'));
                console.log('Project'.red, project.id.toString().red, '\n', err);
                done();
            }

            async.parallel({
                project: function (done) {
                    project.updateAttributes(result.project)
                        .success(function () {done()})
                        .error(function (err) {error(err, done)});
                },
                contractors: function (done) {
                    var contractors =
                        [result.ref.beneficiary]
                        .concat(result.ref.partners)
                        .concat(result.ref.executors);
                    async.each(contractors, function (contractor, done) {
                        Contractor.findOrCreate(
                            {id:contractor.id},
                            {id:contractor.id, name:contractor.name})
                        .success(function () {done()})
                        .error(function (err) {error(err, done)});
                    }, done);
                },
                mtm: function (done) {
                    async.each(['Partners', 'Executors'], function (name, done) {
                        async.each(result.ref[name.toLowerCase()], function (contractor, done) {
                            models[name].findOrCreate(
                                {project_id:project.id, contractor_id:contractor.id},
                                {project_id:project.id, contractor_id:contractor.id})
                            .success(function () {done()})
                            .error(function (err) {error(err, done)});
                        }, done);
                    }, done);
                },
                program: function (done) {
                    var program = result.ref.program;
                    Program.findOrCreate(
                        {id:program.id},
                        {id:program.id, name:program.name, source:program.source})
                    .success(function () {done()})
                    .error(function (err) {error(err, done)});
                }
            }, done);
        });
    },
    all: function (done) {
        async.waterfall([
            this.total,
            function (projects, done) {
                async.eachLimit(projects, 5, function (project, done) {
                    exports.project.page(project, function () {
                        console.log('Project'.green, project.id.toString().green);
                        done();
                    });
                }, done);
            }
        ], done);
    }
}
