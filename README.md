## QuteUnit

QuteUnit introduces a QUnit-like API to test simple Javascript functions via phantomjs or nodejs. This works by running all your tests in the runtime of choice with out bootstraping API. Then, our API export all runtime information to a html file and then display it to you using the actual QUnit. Here are some of our features:
* easy to use QUnit API
* informative auto message, specifying only a testing function, their arguments, and expecting result. Everything in 1 line.
* beautiful qunit report output
* can use phantom's require('webpage').create()
* callable from terminal

#### Installation
```
sudo npm install -g https://github.com/heartnetkung/QuteUnit/tarball/master
```

## Example

#### Test Code (test.js)
```javascript
exports.test = function(testLib,webpage) {
	with(testLib) {
		test('isNode', function() {
			//pass if we're running in node
			ok(require('fs').workingDirectory, 'It is phantom');
			//pass if we're running in phantomjs
			ok(require('fs').readFileSync, 'It is node');
		});

		test('timesTwo(number)', function() {
			var timesTwo = function(a) {
				return a * 2;
			};
			//output call(2) === 4
			auto(timesTwo, 4, 2);
			//output call(null) === 0
			auto(timesTwo,0,null);
		});

		test('webpage',function(){
			var result=webpage.evaluate(function(){
				//jquery injected by default
				return $.extend({a:2},{a:3});
			});
			ok(result&&result.a===3,'jquery works! (only in phantomjs)');
		});

		module('my-advance-module');
		test('parseJson(jsonString)',function(){
			//require any module of your choice relative to this file
			var parseJson=require('../controller/my-advance-module').parseJson;
			//output call('{"a":3}') === {a:3}
			autoDeepEqual(parseJson,{a:3},'{"a":3}');
		})
	}
};
```

#### Command Line
```
qutephantom ./test1 ./test2 or qutenode ./test1 ./test2
```
where the current directory has the test.js file. Actually the arguments will be used be require().

## API

We support the following methods:
* all assert methods (http://api.qunitjs.com/category/assert/)
* `test()` and `module()` (http://api.qunitjs.com/category/test/)
* `auto(functionToTest,expect,functionArgs...)` and all the methods with the same signature `autoDeepEqual`, `autoEqual`, `autoNotDeepEqual`, `autoNotEqual`,
	`autoNotPropEqual`, `autoNotStrictEqual`, `autoPropEqual`, `autoStrictEqual`


