var latestCallback = null,
	result = '';
var encodeContent = function(anything, isFirst) {
	if (typeof anything === 'undefined')
		return '';
	if ((anything instanceof RegExp) || (typeof anything === 'function'))
		return (isFirst ? '' : ',') + 'eval(' + anything + ')';
	return (isFirst ? '' : ',') + 'JSON.parse(\'' + (JSON.stringify(anything) ||
		'').replace(/'/g, '\\u0027').replace(/"/g, '\\u0022').replace(/\\n/g, '\\\\n') +
		'\')';
};
exports.getResult = function(sourceCodeArray, mode) {
	var QUNIT_TEMPLATE =
		'<!DOCTYPE html><html><head><meta charset="utf-8"><title>mode_here</title><link rel="stylesheet" href="http://code.jquery.com/qunit/qunit-git.css"></head><body><div id="qunit"></div><div id="qunit-fixture"></div><br><br><center><h3>Test Code</h3><div id="source"></div></center><script src="http://code.jquery.com/qunit/qunit-git.js"></script><script>script_here ;var sourceList=source_here;var parent=document.getElementById("source");for(var i=0,ii=sourceList.length;i<ii;i++){var a=document.createElement("a");a.innerHTML=sourceList[i];a.href=sourceList[i];a.style.display="block";parent.appendChild(a);}</script></body></html>';
	return QUNIT_TEMPLATE.replace(/script_here/, result).replace(/source_here/,
		JSON.stringify(sourceCodeArray)).replace(/mode_here/, mode);
};

var testLib = exports.testLib = {
	test: function(description, testCodeFunction) {
		result += 'test(\'' + description + '\',function(){\n';
		if (latestCallback && latestCallback.setup)
			latestCallback.setup();
		testCodeFunction();
		if (latestCallback && latestCallback.teardown)
			latestCallback.teardown();
		result += "\n});\n";
	},
	module: function(name, callback) {
		result += 'module(\'' + name + '\');\n';
		latestCallback = callback;
	},
	ok: function(bool, description) {
		result += '  ok(' + !! bool + ',\'' + (description || '') + '\');\n';
	},
	throws: function(block, expect, message) {
		var serializedTemp, temp = null;
		try {
			block();
		} catch (e) {
			temp = e;
		}
		if (temp == null)
			serializedTemp = '';
		else if (temp instanceof Error)
			serializedTemp = 'throw new Error("' + temp.message + '")';
		else {
			var temp2 = JSON.parse(JSON.stringify(temp));
			delete temp2.line;
			delete temp2.sourceURL;
			delete temp2.sourceId;
			delete temp2.stack;
			delete temp2.stackArray;
			serializedTemp = 'throw ' + JSON.stringify(temp2);
		}

		result += ['  throws(function(){', serializedTemp, '}', encodeContent(expect),
			encodeContent(message), ');\n'
		].join('');
	}
};

var equalFunctionBuilder = function(name) {
	return function(actual, expect, description) {
		result += '  ' + name + '(' + encodeContent(actual, true) + encodeContent(
			expect) + encodeContent(description) + ');\n';
	};
};
var autoFunctionBuilder = function(name) {
	var not = name.substr(0, 3) === 'not';
	return function(func, expect /*arguments*/ ) {
		var args = Array.prototype.slice.call(arguments, 2);
		var argString = JSON.stringify(args);
		if (argString)
			argString = argString.substr(1, argString.length - 2);
		var message = ['call(', argString, not ? ') !== ' : ') === ', JSON.stringify(
			expect)];
		testLib[name](func.apply(null, args), expect, message.join(''));
	}
}
var allFunctions = ['deepEqual', 'equal', 'notDeepEqual', 'notEqual',
	'notPropEqual', 'notStrictEqual', 'propEqual', 'strictEqual'
];
for (var i = 0, ii = allFunctions.length; i < ii; i++) {
	testLib[allFunctions[i]] = equalFunctionBuilder(allFunctions[i]);
	var capFirst = allFunctions[i][0].toUpperCase() + allFunctions[i].substring(1);
	testLib['auto' + capFirst] = autoFunctionBuilder(allFunctions[i]);
}
testLib.auto = testLib.autoDeepEqual;
