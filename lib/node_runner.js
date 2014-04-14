#! /usr/bin/env node
 // -*- js -*-
try {
	var path = require('path'),
		cwd = process.cwd(),
		qunit = require('./qunit_wrapper'),
		childProcess = require('child_process'),
		fs = require('fs'),
		args = process.argv.slice(2),
		srcList = [];

	for (var i = 0, ii = args.length; i < ii; i++) {
		var temp = require(cwd + '/' + args[i]);
		temp.test(qunit.testLib);
		srcList.push(args[i].replace(/^\.\//, '') + '.js');
	}

	fs.writeFile(cwd + '/' + 'qunit.html', qunit.getResult(srcList,'Unit Test via Nodejs'), function() {
		childProcess.exec('xdg-open qunit.html', function() {
			process.exit(0);
		});
	});

} catch (e) {
	console.log("FATAL: " + (e.message || e));
	process.exit(1);
}
