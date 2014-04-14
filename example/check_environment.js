exports.test = function(testLib) {
	with(testLib) {
		test('isNode', function() {
			ok(!(require('fs').workingDirectory), 'It is node');
			ok(!(require('fs').readFileSync), 'It is phantom');
		});
	}
};
