var yargs = require('yargs');
var fs = require('fs')

var InputManager = function() {
    this.loggerDefaults = {
        type: "file",
        details: {
            filename: 'error.log'
        }
    }
}

InputManager.prototype = {
    loggerDefaults: null,

    getArguments: function() {
        return yargs
            .usage('Crawls parliament.bg and extracts MPs\' voting infromation.\nUsage: $0')
            .options('u', {
                demand: true,
                alias: 'url',
                description: 'Url to act as a start page for the crawl'
            })
            .options('d', {
                alias: 'date',
                description: 'Date as unix time. Start date for the crawl'
            })
            .options('l', {
                alias: 'loggerSettingsFile',
                description: 'Settings for the logger. Accepts a filepath to the config file. If not provided, settings default to logging to error.log file '
            }).wrap(100)
            .argv
    },

    retrieveLoggerConfig: function(argv) {
        var loggerSettings = this.loggerDefaults;
        if (typeof argv.loggerSettingsFile != 'undefined') {
            loggerSettings = JSON.parse(fs.readFileSync(argv.loggerSettingsFile));
        }
        return loggerSettings;
    }
}

exports = module.exports = InputManager;