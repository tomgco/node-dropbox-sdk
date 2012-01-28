var oauth = require('../lib/oauth'),
	should = require('should');

describe('oauth', function() {
	var token = 'token',
		tokenSecret = 'tokenSecret',
		build = oauth(token, tokenSecret);

	it('should return a function', function(done) {
		var header = build();
		build.should.be.an.instanceof(Function);
		done();
	});

	describe('#oauth()', function() {
		it('should return a oauth_consumer_key based on input', function(done) {
			var header = build();
			header.oauth_consumer_key.should.equal(token);
			done();
		});

		it('should return with a signature method of plaintext', function(done) {
			var header = build();
			header.oauth_signature_method.should.equal('PLAINTEXT');
			done();
		});

		it('should return with oauth version 1.0', function(done) {
			var header = build();
			header.oauth_version.should.equal('1.0');
			done();
		});

		it('should return with tokenSecret& as signature when no previous call has been made', function(done) {
			var header = build();
			header.oauth_signature.should.equal(tokenSecret +'&');
			done();
		});
	});
});