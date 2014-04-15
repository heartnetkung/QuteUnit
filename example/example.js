exports.test = function(testLib, webpage) {
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
			auto(timesTwo, 0, null);
		});

		test('webpage', function() {
			var result = webpage.evaluate(function() {
				//jquery injected by default
				return $.extend({
					a: 2
				}, {
					a: 3
				});
			});
			ok(result && result.a === 3, 'jquery works! (only in phantomjs)');
		});

		test('manual conversion', function() {
			equal('hello\n', 'hello\n', 'nga');
		});

		test('throws', function() {
			function CustomError(message) {
				this.message = message;
			}

			CustomError.prototype.toString = function() {
				return this.message;
			};

			throws(
				function() {
					throw "error"
				},
				"throws with just a message, not using the 'expected' argument"
			);
			// throws(
			// 	function() {
			// 		throw new CustomError();
			// 	},
			// 	CustomError,
			// 	"raised error is an instance of CustomError"
			// );
			throws(
				function() {
					throw new CustomError("some error description");
				},
				/description/,
				'raised error message contains \'description\''
			);
		});
	}
};
