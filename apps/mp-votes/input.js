var optimist = require('optimist');
var fs = require('fs')
var flow = require('q')

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
        return optimist
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
            .options('t', {
                alias: 'temp',
                default: '/var/tmp',
                description: 'Temporary directory to store the raw transcripts'
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
    },

    findTargetDates: function(argv) {
        // Sort out correct input for targeted dates - argument or piped json with forced dates
        var inputReady = flow.defer();
        if (typeof argv.date != 'undefined') {
            inputReady.resolve(new Date(argv.date * 1000))
        }
        var jsonForcedDates = '';
        process.stdin.resume();
        process.stdin.on('data', function(buf) { jsonForcedDates += buf.toString(); });
        process.stdin.on('end', function() {
            if (jsonForcedDates=='') return;
            inputReady.resolve(JSON.parse(jsonForcedDates));
        });
        // Allow 100ms before checking for stdin
        setTimeout(function() {
            if (jsonForcedDates=='') {
                inputReady.resolve()
                process.stdin.emit("end"); // prevents hanging due to empty stdin
            }
        }, 100)

        return inputReady.promise;
    }
}

exports = module.exports = InputManager;