exports = module.exports =  {
	readFile: function(path) {
		return csv()
			.from
			.stream(fs.createReadStream(path))
	}
}