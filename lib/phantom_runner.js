try {
	var exportHtml;
	var fs = require('fs');
	var qunit = require('./qunit_wrapper');

	//start
	(function() {
		var page = require('webpage').create();
		page.onConsoleMessage = page.onAlert = page.onError = function(msg) {
			console.log(msg);
		};
		page.open('http://127.0.0.1:1234', function(status) {
			try {
				page.injectJs('jquery.min.js');

				var args = require('system').args;
				var cwd = fs.workingDirectory;
				var srcList = [];
				for (var i = 1, ii = args.length; i < ii; i++) {
					var temp = require(cwd + '/' + args[i]);
					temp.test(qunit.testLib, page);
					srcList.push(args[i].replace(/^\.\//, '') + '.js');
				}

				fs.write('qunit.html', qunit.getResult(srcList,'Unit Test via Phantomjs'), 'w');
				phantom.exit(0);
			} catch (e) {
				console.log("FATAL: " + (e.message || e));
				phantom.exit(1);
			}
		})
	})();

} catch (e) {
	console.log("FATAL: " + (e.message || e));
	phantom.exit(1);
}
