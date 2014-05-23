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
      .usage('Parses downloaded XLS files.\nUsage: $0')
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
