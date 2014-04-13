var path = require('path'),
	childProcess = require('child_process'),
	phantomjs = require('phantomjs'),
	binPath = phantomjs.path;

console.log(process.cwd());
console.log(JSON.stringify(process.argv));
var childArgs = [path.join(__dirname, 'test_runner.js'),
	'./test', '--arguments', inputDir, outputDir, tempDir
];
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
	//process.argv
	process.exit(0);
});
