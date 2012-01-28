var Dropbox = require('../').session,
	should = require('should');

describe('Dropbox', function() {
	describe('#session()', function() {
		it('should throw an exception when no App Key is provided', function(done) {
			(function(){
				var session = new Dropbox();
			}).should.throw(/^App Key/);
			done();
		});

		it('should throw an exception when no App Secret is provided', function(done) {
			var config = {
				appKey: 'AppKey'
			};

			(function(){
				var session = new Dropbox(config);
			}).should.throw(/^App Secret/);
			done();
		});

		describe('#()', function() {
			var config = {
					appKey: 'AppKey',
					appSecret: 'AppSecret'
				},
				sess = {},
				session = new Dropbox(config, sess);
			
			describe('#sign()', function() {
				it('should return a valid oauth object', function(done) {
					var oauthHeader = session.sign();
					oauthHeader.should.have.keys(['oauth_consumer_key',
													'oauth_signature',
													'oauth_timestamp',
													'oauth_nonce',
													'oauth_signature_method',
													'oauth_version']);
					done();
				});
			});

			describe('#(buildAuthHeader()', function() {
				var oauthHeaderObj = session.sign();
				var header = session.buildAuthHeader(oauthHeaderObj);
				
				it('should return a string', function(done) {
					header.should.be.a('string');
					done();
				});

				it('should begin with \'Oauth\'', function(done) {
					header.should.match(/^OAuth/);
					done();
				});

				it('should not end with a comma', function(done) {
					header.should.not.match(/,$/);
					done();
				});
			});
		});
	});
});