// Decorator of the normal run script.
// Pipe the output of the mp_votes run to it like so:
//   node run.js | node decorator/sql.js
//
// Instead of outputting nested JSON objects,
// it outputs 2 level objects containing destination (table name)
// and row object suitable for storage in SQL DB

var LineStream = require('byline').LineStream;

process.stdin.pipe(new LineStream()).on('data', function(line) {
	var dayOfAnMp = JSON.parse(line.toString());
	// Output mp presence in parliament
	var mpPresence = {
		destination: "mp_presence",
		data: {
			registration: dayOfAnMp.registration.val,
			commenced_at: dayOfAnMp.registration.time
		}
	}
	console.log(JSON.stringify(mpPresence));

	// Output mp vote records
	dayOfAnMp.votes.forEach(function(vote) {
		var mpVote = {
			destination: "mp_vote",
			data: {
				vote: vote.val,
				topic: vote.topic,
				time: vote.time
			}
		}
		console.log(JSON.stringify(mpVote));
	});
})