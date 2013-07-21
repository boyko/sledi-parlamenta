var spawn = require('child_process').spawn;
var byline = require('byline');

var child = spawn('node', ['./test.js'])

var arr = []
child.stdout.on('data', function(line) {
	arr.push(line.toString());
}).on('finish',function() {
	console.log(arr)
})