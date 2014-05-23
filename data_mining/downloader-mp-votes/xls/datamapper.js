var flow = require('q');
var XLSjs = require('xlsjs');
var CsvParser = require('csv-parse');

var XLSDataMapper = function(path, logger) {
  this.path = path;
  this.logger = logger;
  this.xls = this.read(path)
}

XLSDataMapper.prototype = {
  path: null,
  xls: null,

  read: function(path) {
    return XLSjs.readFile(path)
  },

  eachRow: function(sheet, callback) {
    var self = this;
    var parsing = flow.defer();
    var parser = CsvParser();

    parser.on('readable', function(){
      var row;
      while(row = parser.read()){
        callback(row)
      }
    });

    parser.on('error', function(err){
      self.logger.info('Error while parsing CSV ('+ self.path + '):' + err)
    });

    parser.on('finish', function(err){
      parsing.resolve()
    });

    parser.write(XLSjs.utils.sheet_to_csv(sheet));
    parser.end();
    return parsing.promise;
  },

  getSheetNames: function() {
    return this.xls.SheetNames;
  },

  getFirstSheet: function() {
    return this.getSheetByIndex(0)
  },

  getSheetByIndex: function(num) {
    var sheetName = this.getSheetNames()[num];
    return this.xls.Sheets[sheetName];
  },

  getCellValue: function(sheet, cellName) {
    return sheet[cellName].v;
  }
}

exports = module.exports = XLSDataMapper;
