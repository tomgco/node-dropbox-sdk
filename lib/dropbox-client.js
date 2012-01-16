var request = require('request'),
	qs = require('querystring'),
	dropbox = require('./dropbox');
	
module.exports = function(dropboxSession, root) {
	root = root || 'sandbox';

	var buildUrl = function(url, params, contentServer) {
		var host = contentServer ? dropbox.contentApiUrl : dropbox.apiUrl;
		return host + dropbox.apiVersion + url + qs.stringify(params);
	};

	var get = function(url, cb) {
		var req = request.defaults({
			headers: {
				'Authorization': qs.stringify(dropboxSession.sign(dropboxSession.token))
			}
		});
		console.log(dropboxSession);
		req.get(url, function(err, res, resBody) {
			cb(res.statusCode, qs.parse(resBody));
		});
	};

	var put = function(url, body, cb) {
		//possibly use underscore to be able to extend
		var req = request.defaults({
			headers: {
				'Authorization': qs.stringify(dropboxSession.sign(dropboxSession.token)),
				'body': body
			}
		});
		req.put(url, function(err, res, resBody) {
			cb(res.statusCode, qs.parse(resBody));
		});
	};

	return {

		/**
		*	@param {Function} cb callback
		*/
		accountInfo: function(cb) {
			get(buildUrl('/account/info'), cb);
		},

		putFile: function(toPath, file, params, cb) {
			params = params || {};
			var path = '/files/' + root + qs.escape(toPath) + '?' + qs.stringify(params);
			put(buildUrl(path, params, true), file, cb);
		},

		getFile: function(fromPath, rev, cb) {
			var prams = {};
			if (typeof rev !== undefined) params.rev = rev;
			var path = '/files/' + root + qs.escape(fromPath);
			get(buildUrl(path, params, true), cb);
		}
	};
};