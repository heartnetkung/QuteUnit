#! /usr/bin/env node
 // -*- js -*-

var path = require('path'),
	childProcess = require('child_process'),
	phantomjs = require('phantomjs'),
	binPath = phantomjs.path;

var childArgs = [path.join(__dirname, 'phantom_runner.js')]
childArgs = childArgs.concat(process.argv.slice(2));

childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
	console.log(stdout);
	childProcess.exec('xdg-open qunit.html', function() {
		process.exit(0);
	});
})
