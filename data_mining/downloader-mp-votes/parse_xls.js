// first argument - directory with xlses

var fs = require('fs');
var XLS = require('xlsjs');

// helper functions
function isIV(xls) {
  return xls.SheetNames.indexOf("Регистрации и гласувания по ПГ") === -1;
}

function getXLSFilePaths(dir) {
  return fs.readdirSync(dir)
           .map(function(file) { return dir + "/" + file })
           .filter(function(file) { return /\.xls/.test(file) });
}

function getFolders(dir) {
  var list = fs.readdirSync(dir)
  return list.filter(function(file_or_folder_name) {
    return fs.statSync(dir + "/" + file_or_folder_name).isDirectory();
  }).map(function(folder) { return dir + "/" + folder });
}

function splitter(sheet) {
  var rows = XLS.utils.sheet_to_csv(sheet).split("\n");
  return rows.map(function(row) { return row.split(",") });
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

function getOrder(file_paths) {
  xls_0 = XLS.readFile(file_paths[0]);
  xls_1 = XLS.readFile(file_paths[1]);

  if(isIV(xls_0))
    parseData(getFirstSheet(xls_0), getFirstSheet(xls_1));
  else
    parseData(getFirstSheet(xls_1), getFirstSheet(xls_0));
}

function fetchSessions(session_dirs) {
  session_dirs.forEach(function(session_dir) {
    var file_paths = getXLSFilePaths(session_dir);
    getOrder(file_paths);
  });
}

function init() {
  var dir = process.argv[2];
  fetchSessions(getFolders(dir))
}

init();

