
var Sequelize = require('sequelize')

var sequelize = new Sequelize('eu-tenders', 'liolio', 'karamba', {
    dialect: 'mysql', // mysql, sqlite, postgres, mariadb
    define: {
        timestamps:false
    },
    logging: false
})


var Project = sequelize.define('Project', {
    id: {type:Sequelize.INTEGER, primaryKey:true},
    isun: {type:Sequelize.STRING(255)},
    number: Sequelize.INTEGER,

    date_contract: Sequelize.DATE,
    date_begin: Sequelize.DATE,
    date_end: Sequelize.DATE,

    name: {type:Sequelize.STRING(255)},
    status: Sequelize.STRING(45),
    place: Sequelize.STRING(500),
    description: Sequelize.TEXT,
    activities: Sequelize.TEXT,
    duration: Sequelize.DECIMAL,

    budget_approved: Sequelize.INTEGER,
    budget_total: Sequelize.INTEGER,
    budget_paid: Sequelize.INTEGER,
    budget_bfp_total: Sequelize.INTEGER,
    budget_bfp_eu: Sequelize.INTEGER,
    budget_bfp_nat: Sequelize.INTEGER,
    budget_benef: Sequelize.INTEGER
}, {
    timestamps: false
})


var Contractor = sequelize.define('Contractor', {
    id: {type:Sequelize.INTEGER, primaryKey:true},
    name: {type:Sequelize.STRING(255), allowNull:false},
    address: Sequelize.STRING(500)
}, {
    timestamps: false
})


var Program = sequelize.define('Program', {
    id: {type:Sequelize.INTEGER, primaryKey:true},
    name: {type:Sequelize.STRING(500), allowNull:false},
    source: Sequelize.STRING(45)
}, {
    timestamps: false
})


var Executors = sequelize.define('Executors', {
    project_id: {type:Sequelize.INTEGER, primaryKey:true},
    contractor_id: {type:Sequelize.INTEGER, primaryKey:true}
}, {
    timestamps: false
})


var Partners = sequelize.define('Partners', {
    project_id: {type:Sequelize.INTEGER, primaryKey:true},
    contractor_id: {type:Sequelize.INTEGER, primaryKey:true}
}, {
    timestamps: false
})


Contractor.hasMany(Project, {foreignKey:'beneficiary_id'})
Program.hasMany(Project, {foreignKey:'program_id'})

// works but I want actual models in this case
// Contractor.hasMany(Project, {foreignKey:'project_id', through:'project_has_contractor'})
// Project.hasMany(Contractor, {foreignKey:'contractor_id', through:'project_has_contractor'})

// Contractor.hasMany(Project, {foreignKey:'project_id', through:'project_has_partner'})
// Project.hasMany(Contractor, {foreignKey:'contractor_id', through:'project_has_partner'})

Contractor.hasMany(Project, {through:Executors, foreignKey:'project_id'})
Project.hasMany(Contractor, {through:Executors, foreignKey:'contractor_id'})

Contractor.hasMany(Project, {through:Partners, foreignKey:'project_id'})
Project.hasMany(Contractor, {through:Partners, foreignKey:'contractor_id'})


exports.Project = Project;
exports.Contractor = Contractor;
exports.Program = Program;
exports.Executors = Executors;
exports.Partners = Partners;


// start only if this module is executed from the command line
if (require.main === module) sequelize.sync();
