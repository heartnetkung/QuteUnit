exports.test = function(testLib) {
	with(testLib) {
		test('isNode', function() {
			ok(!(require('fs').workingDirectory), 'It is node');
			ok(!(require('fs').readFileSync), 'It is phantom');
		});
		test('timesTwo(number)', function() {
			var timesTwo = function(a) {
				return a * 2;
			};
			auto(timesTwo, 4, 2);
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

			throws(
				function() {
					throw new CustomError();
				},
				CustomError,
				"raised error is an instance of CustomError"
			);
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
