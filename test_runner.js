try {
	var result = '';
	var testLib, exportHtml;

	//code builder
	(function() {
		var latestCallback = null;
		var encodeContent = function(anything) {
			return JSON.stringify(anything).replace(/\\/g, '\\\\');
		};
		testLib = {
			test: function(description, testCodeFunction) {
				result += 'test(\'' + description + '\',function(){\n';
				if (latestCallback && latestCallback.setup)
					latestCallback.setup();
				testCodeFunction();
				if (latestCallback && latestCallback.teardown)
					latestCallback.teardown();
				result += "});\n";
			},
			module: function(name, callback) {
				result += 'module(\'' + name + '\');\n';
				latestCallback = callback;
			},
			ok: function(bool, description) {
				result += '  ok(' + !! bool + ',\'' + (description || '') + '\');\n';
			},
			equal: function(actual, expect, description) {
				result += '  equal(JSON.parse(\'' + encodeContent(actual) +
					'\'),JSON.parse(\'' + encodeContent(expect) + '\'),\'' + (description ||
						'') + '\');\n';
			},
			auto: function(func, expect /*arguments*/ ) {
				var args = Array.prototype.slice.call(arguments, 2);
				var argString = JSON.stringify(args);
				if (argString)
					argString = argString.substr(1, argString.length - 2);
				var message = ['call(', argString, ') == ', JSON.stringify(expect)];
				testLib.equal(func.apply(null, args), expect, message.join(''));
			}
		};
	})();

	//export html
	(function() {
		var fs = require('fs');
		var OUTPUT_PATH = 'test';
		var QUNIT_TEMPLATE =
			'<!DOCTYPE html><html><head><meta charset="utf-8"><title>Build Result</title><link rel="stylesheet" href="http://code.jquery.com/qunit/qunit-git.css"></head><body><div id="qunit"></div><div id="qunit-fixture"></div><br><br><center><h3>Test Code</h3><div id="source"></div></center><script src="http://code.jquery.com/qunit/qunit-git.js"></script><script>script_here ;var sourceList=source_here;var parent=document.getElementById("source");for(var i=0,ii=sourceList.length;i<ii;i++){var a=document.createElement("a");a.innerHTML=sourceList[i];a.href=sourceList[i];a.style.display="block";parent.appendChild(a);}</script></body></html>';

		exportHtml = function(jsCode, sourceCodeArray) {
			var exportingContent = QUNIT_TEMPLATE.replace(/script_here/, jsCode).replace(
				/source_here/, JSON.stringify(sourceCodeArray));
			fs.write(OUTPUT_PATH + '/qunit.html', exportingContent, 'w');
		};
	})();

	//start
	(function() {
		var page = require('webpage').create();
		page.onConsoleMessage = page.onAlert = page.onError = function(msg) {
			console.log(msg);
		};
		page.open('http://127.0.0.1:1234', function(status) {
			try {
				page.injectJs('../runtime_scripts/jquery.min.js');

				var args = require('system').args;
				var srcList = [];
				for (var i = 1, ii = args.length; i < ii; i++) {
					var temp = require(args[i]);
					temp.test(testLib, page);
					srcList.push(args[i].replace(/^\.\//, '') + '.js');
				}

				exportHtml(result, srcList);
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
