var request = require('request'),
	sign = require('oauth'),
	qs = require('querystring');
	
module.exports = function(dropboxSession, accessType) {
	
	var root = root || 'sandbox';

	var buildUrl = function(url, params, contentServer) {
		var host = contentServer ? dropboxSession.contentApiUrl : dropboxSession.apiUrl;
		return dropbox.apiVersion . url . qs.stringify(params);
	};

	return {

		/**
		*	@param {Function} cb callback
		*/
		accountInfo: function(cb) {
			dropboxSession.get(buildUrl('/account/url'));
		},

		putFile: function(toPath, file, params, cb) {
			params = params || {};
			var path = '/files/' + root + qs.escape(path) + '?' + qs.stringify(params);
			dropbox.put(buildUrl(path, params, true), file, cb);
		},

		getFile: function(fromPath, rev, cb) {
			var prams = {};
			if (typeof rev !== undefined) params.rev = rev;
			var path = '/files/' + root + qs.escape(fromPath);
			dropbox.get(buildUrl(path, params, true), cb);
		}
	};
};