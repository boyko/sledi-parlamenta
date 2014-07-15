var flow = require('q');
var LineStream = require('byline').LineStream;
var InputManager = require('./input')
var XLSDataMapper = require('./datamapper')

// input handling
var inputMan = new InputManager();
var argv = inputMan.getArguments();

var logger = require('logger-generator')(inputMan.retrieveLoggerConfig(argv))

function getColumn(matrix, idx) {
  return matrix.map(function(row) { return row[idx] });
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var markers = {
  groupVoting: "Регистрации и гласувания по ПГ",
  voting: "ГЛАСУВАНЕ",
  topicSplitter: "по тема"
}

var Parser = function(individualXLS, groupXLS) {
  this.individualXLS = individualXLS;
  this.groupXLS = groupXLS;
}

Parser.isIndividualVoting = function(xls) {
  return xls.getSheetNames().indexOf(markers.groupVoting) === -1;
}

Parser.prototype = {
  individualXLS: null,
  groupXLS: null,

  parse: function() {
    var parsing = flow.defer();
    var session = {}

    var individualVotingParsing = this.extractVotings()
    var groupVotingParsing = this.extractVotes()

    flow.all([individualVotingParsing, groupVotingParsing]).spread(function(votings, votes) {
      session = {
        date: votings.shift(),
        members: getColumn(votes, 0)
      };

      votings = votings.map(function(voting, i) {
        return {
          time: voting[0],
          topic: voting[1],
          votes: getColumn(votes, i+1)
        }
      });

      session.votings = votings;
      parsing.resolve(session);
    }).done()

    return parsing.promise;
  },

  extractVotings: function() {
    var votings = [];
    var self = this;
    var sheet = self.individualXLS.getFirstSheet();

    var gettingVotings = self.individualXLS.eachRow(sheet, function(row) {
      if (row.indexOf(markers.voting) === -1) return;
      var regex = new RegExp('(\\d+:\\d+) ' + markers.voteSplitter + ' (.+)')
      votings.push(row.match(regex))
    }).then(function() {
      var registration = self.individualXLS.getCellValue(sheet, 'A2').match(/(\d+-\d+-\d+) (\d+:\d+)/);
      gettingVotings.resolve([registration[1], [registration[2], "Регистрация"]].concat(votings));
    })

    return gettingVotings
  },

  extractVotes: function() {
    var self = this;
    var votes = [];
    var sheet = self.individualXLS.getFirstSheet();

    var gettingVotes = self.groupXLS.eachRow(sheet, function(row) {
      if (!isNumber(row[2])) return;
      var vote = row.filter(function(cell, i) {
        return ["+", "-", "=", "0", "П", "О", "Р"].indexOf(cell) > -1 || i === 0;
      });
      votes.push(vote)
    }).then(function() {
      gettingVotes.resolve(votes)
    })

    return gettingVotes
  }
}

function init(paths) {
  var xls = [new XLSDataMapper(paths[0], logger), new XLSDataMapper(paths[1], logger)]

  if(Parser.isIndividualVoting(xls[0])) xls.reverse()

  var parser = new Parser(xls[0], xls[1])

  parser.parse().then(function(session) {
    console.log(JSON.stringify(session))
  })
}

process.stdin.pipe(new LineStream()).on('data', function(line) {
  init(JSON.parse(line.toString()))
})
