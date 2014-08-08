
var should = require('should'),
    async = require('async'),
    moment = require('moment');

var eu = require('../lib/index')();

var models = require('../model/models'),
    Project = models.Project,
    Contractor = models.Contractor,
    Program = models.Program,
    Executors = models.Executors,
    Partners = models.Partners;


describe.skip('scrape', function () {
    describe('list', function () {
        it('total', function (done) {
            eu.scrape.projects.total(function (err, result) {
                if (err) return done(err);
                result.total.should.be.above(10000);
                result.viewstate.should.be.type('string');
                done();
            });
        });
        it('page', function (done) {
            async.waterfall([
                function (done) {
                    eu.scrape.projects.page({page:1}, done);
                },
                function (viewstate, done) {
                    viewstate.should.be.type('string');
                    Project.findAll().success(function (projects) {
                        projects.length.should.equal(10);
                        done();
                    }).error(function (err) {done(err)});
                }
            ], done);
        });
        it('all', function (done) {
            eu.scrape.projects.total = function (done) {done(null, {total:20})};
            async.series([
                function (done) {
                    eu.scrape.projects.all(done);
                },
                function (done) {
                    Project.findAll().success(function (projects) {
                        projects.length.should.equal(20);
                        done();
                    })
                    .error(function (err) {done(err)});
                }
            ], done);
        });
    });


    describe('single', function () {
        it('total', function (done) {
            eu.scrape.project.total(function (err, projects) {
                projects.length.should.equal(20);
                done();
            });
        });
        it('page', function (done) {
            Project.find({where:{id:67740}}).success(function (project) {
                eu.scrape.project.page(project, function (err) {
                    if (err) return done(err);
                    async.parallel([
                        function (done) {
                            Project.find({where:{id:67740}}).success(function (project) {
                                project.id.should.equal(67740);
                                project.isun.should.equal('BG161PO003-2.1.13-0112-C0001');
                                moment(project.date_contract).format('YYYY-MM-DD').should.equal('2012-04-12');
                                project.beneficiary_id.should.equal(8573);
                                project.budget_bfp_eu.should.equal(302916);
                                project.budget_total.should.equal(593952);
                                done();
                            }).error(function (err) {done(err)});
                        },
                        function (done) {
                            Contractor.findAll().success(function (contractors) {
                                contractors.length.should.equal(10);
                                done();
                            }).error(function (err) {done(err)});
                        },
                        function (done) {
                            Program.findAll().success(function (programs) {
                                programs.length.should.equal(1);
                                done();
                            }).error(function (err) {done(err)});
                        },
                        function (done) {
                            Executors.findAll().success(function (executors) {
                                executors.length.should.equal(9);
                                done();
                            }).error(function (err) {done(err)});
                        },
                        function (done) {
                            Partners.findAll().success(function (partners) {
                                partners.length.should.equal(0);
                                done();
                            }).error(function (err) {done(err)});
                        }
                    ], done);
                });
            }).error(function (err) {done(err)});
        });
        it('all', function (done) {
            eu.scrape.project.total = function (done) {
                Project.find({where:{id:67740}}).success(function (project1) {
                    Project.find({where:{id:68017}}).success(function (project2) {
                        done(null, [project1, project2]);
                    }).error(function (err) {done(err)});
                }).error(function (err) {done(err)});
            };
            eu.scrape.project.all(function () {
                async.parallel([
                    function (done) {
                        Contractor.findAll().success(function (contractors) {
                            contractors.length.should.equal(16);
                            done();
                        }).error(function (err) {done(err)});
                    },
                    function (done) {
                        Program.findAll().success(function (programs) {
                            programs.length.should.equal(2);
                            done();
                        }).error(function (err) {done(err)});
                    },
                    function (done) {
                        Executors.findAll().success(function (executors) {
                            executors.length.should.equal(14);
                            done();
                        }).error(function (err) {done(err)});
                    },
                    function (done) {
                        Partners.findAll().success(function (partners) {
                            partners.length.should.equal(0);
                            done();
                        }).error(function (err) {done(err)});
                    }
                ], done);
            });
        });
    });
});
