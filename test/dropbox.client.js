var Dropbox = require('../'),
	should = require('should');

describe('Dropbox', function() {
	var config = {
			appKey: 'AppKey',
			appSecret: 'AppSecret'
		},
		sess = {},
		session = new Dropbox.session(config, sess);

	describe('#client()', function() {
		it('should throw an execption if no session is passed through', function(done) {
			(function(){
				var client = Dropbox.client();
			}).should.throw(/^Dropbox Session/);
			done();
		});
	});
});