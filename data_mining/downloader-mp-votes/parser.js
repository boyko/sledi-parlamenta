var fs = require('fs');
var XLS = require('xlsjs');
var LineStream = require('byline').LineStream;

var voteMapper = {
  "+": "yes",
  "-": "no",
  "=": "abstain",
  "0": "absent",
  "О": "not_registered",
  "Р": "manually_registered",
  "П": "registered"
};

var markers = {
  groupVoting: ["Регистрации и гласувания по ПГ",
    "Регистрации и гласувания по парламентарни групи"],
  topicSplitter: " по тема ",
  timeRegex: /\d{2}:\d{2}/,
  dateRegex: /\d{2}-\d{2}-\d{4}/
};

// helper functions
function isGroupVoting(xls) {
  return markers.groupVoting.indexOf(xls.SheetNames[0]) > -1;
}

// transform the csv to a matrix
function prepare(sheet) {
  return XLS.utils.sheet_to_csv(sheet).split("\n")
         .map(function(row) { return row.split(",") });
}

function getFirstSheet(xls) {
  var sheetName = xls.SheetNames[0];
  return xls.Sheets[sheetName];
}

function column(matrix, idx) {
  return matrix.map(function(row) { return row[idx] });
}

// main functions
function extractVotesOrRegistrations(votesData, mapObject) {
  return votesData.map(function(row) {
    // filter cells that are not votings/registrations values
    return row.filter(function(cell) { return Object.keys(mapObject).indexOf(cell) > -1; })
              // remap cells to human readable values
              .map(function(cell) { return mapObject[cell] });
  });
};

function extractMembers(votesData) {
  return votesData.map(function(row) { return row[0] });
};

function extractVotings(votingsData) {
  var votings = votingsData
    .filter(function(row) { return /ГЛАСУВАНЕ/.test(row[0]); } )
    .map(function(voting_name_row) {
      var time = voting_name_row[0].match(markers.timeRegex)[0];
      var topic = voting_name_row[0].split(markers.topicSplitter)[1];
      return [time, topic];
    });

  var registrations = votingsData
    .filter(function(row) { return /РЕГИСТРАЦИЯ/.test(row[0]); } )
    .map(function(voting_name_row) {
      var time = voting_name_row[0].match(markers.timeRegex)[0];
      var topic = "Регистрация";
      return [time, topic];
    });

  return registrations.concat(votings);
};

function parseData(iv_sheet, gv_sheet) {

  var votingsData = prepare(gv_sheet),
      votesData = prepare(iv_sheet)
        // fetch only rows with the members and corresponding votings.
        // The rows are filtered by the data in the registration cell - it should be only О, П and Р. (cyrillic)
        .filter(function(row) { return Object.keys(voteMapper).indexOf(row[4]) > -1 }),
      votings = extractVotings(votingsData),
      votes = extractVotesOrRegistrations(votesData, voteMapper),
      session = {
        date: gv_sheet['A2'].v.match(markers.dateRegex)[0],
        members: extractMembers(votesData)
      };

  session.votings = votings.map(function(voting, idx) {
    return {
      time: voting[0],
      topic: voting[1],
      votes: column(votes, idx)
    }
  });

  console.log(JSON.stringify(session));
};

function init(paths) {
  var xls;

  if (paths.length < 2)
    return;

  xls = [XLS.readFile(paths[0]), XLS.readFile(paths[1])];

  if(isGroupVoting(xls[0]))
    xls.reverse();

  parseData(getFirstSheet(xls[0]), getFirstSheet(xls[1]));
};

process.stdin.pipe(new LineStream()).on('data', function(line) {
  init(JSON.parse(line.toString()));
});
