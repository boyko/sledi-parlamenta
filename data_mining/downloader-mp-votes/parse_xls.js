// first argument - directory with xlses

var fs = require('fs');
var XLS = require('xlsjs');
var LineStream = require('byline').LineStream;
var parse = require('csv-parse');

// helper functions
function isIndividualVoting(xls) {
  return xls.SheetNames.indexOf("Регистрации и гласувания по ПГ") === -1;
}

function splitter(sheet) {
  var output = [];
  var parser = parse({delimiter: ','})
  parser.on('readable', function(){
    while(row = parser.read()){
      output.push(row)
    }
  });
  parser.on('error', function(err){
    // TODO implement with logger
  });
  parser.write(XLS.utils.sheet_to_csv(sheet));
  parser.end();

  return output;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getFirstSheet(xls) {
  var sheetName = xls.SheetNames[0];
  return xls.Sheets[sheetName];
}

function column(matrix, idx) {
  return matrix.map(function(row) { return row[idx] });
}

// main functions
function extractVotes(sheet, votings_count) {
  var votes = splitter(sheet);
  return votes
    .filter(function(row) { return isNumber(row[2]) })
    .map(function(row) {
      return row.filter(function(cell, idx) {
        return ["+", "-", "=", "0", "П", "О", "Р"].indexOf(cell) !== -1 || idx === 0;
      });
    });
}

function extractVotings(sheet) {
  var votings = splitter(sheet)
    .filter(function(row) { return /ГЛАСУВАНЕ/.test(row[0]) } )
    .map(function(row) {
      var res = row[0].match(/(\d+:\d+) по тема (.+)/);
      return [res[1], res[2]];
    });
  var registration = sheet['A2'].v.match(/(\d+-\d+-\d+) (\d+:\d+)/);
  return [registration[1], [registration[2], "Регистрация"]].concat(votings);
}

function parseData(iv_sheet, gv_sheet) {
  var votings = extractVotings(gv_sheet),
      votes = extractVotes(iv_sheet),
      session = {
        date: votings.shift(),
        members: column(votes, 0)
      };

  votings = votings.map(function(voting, idx) {
    return {
      time: voting[0],
      topic: voting[1],
      votes: column(votes, idx+1)
    }
  });

  session.votings = votings;

  console.log(JSON.stringify(session));
}

function init(paths) {
  var xls = [XLS.readFile(paths[0]), XLS.readFile(paths[1])]

  if(!isIndividualVoting(xls[0]))
    xls.reverse()

  parseData(getFirstSheet(xls[0]), getFirstSheet(xls[1]));
}

//process.stdin.resume();
process.stdin.pipe(new LineStream()).on('data', function(line) {
  init(JSON.parse(line.toString()))
})
