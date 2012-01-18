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
				'Authorization': dropboxSession.buildAuthHeader(dropboxSession.sign(dropboxSession.tokens.access))
			}
		});
		req.get(url, function(err, res, resBody) {
			// JSON.parse(resBody) or return string?
			cb(res.statusCode, resBody);
		});
	};

	var put = function(url, body, cb) {
		var req = request.defaults({
			headers: {
				'Authorization': dropboxSession.buildAuthHeader(dropboxSession.sign(dropboxSession.tokens.access)),
				'body': body
			}
		});
		req.put(url, function(err, res, resBody) {
			cb(res.statusCode, resBody);
		});
	};

	var post = function(url, body, cb) {
		var req = request.defaults({
			headers: {
				'Authorization': dropboxSession.buildAuthHeader(dropboxSession.sign(dropboxSession.tokens.access)),
				'body': body
			}
		});
		req.post(url, function(err, res, resBody) {
			cb(res.statusCode, resBody);
		});
	};

	return {

		/**
		*	@param {Function} cb callback
		*/
		accountInfo: function(cb) {
			get(buildUrl('/account/info'), cb);
		},

		putFile: function(toPath, file, cb) {
			var params = params || {};
			var path = '/files_put/' + root + '/' + qs.escape(toPath);
			put(buildUrl(path, params, true), file, cb);
		},

		getFile: function(fromPath, cb) { //, rev, cb) {
			var params = {};
			// if (rev !== undefined) params.rev = rev;
			var path = '/files/' + root + '/' + qs.escape(fromPath);
			get(buildUrl(path, params, true), cb);
		},

		copyFile: function(fromPath, toPath, cb) { //, rev, cb) {
			var params = {};
			params.fromPath = fromPath; // escape
			params.toPath = toPath;
			// if (rev !== undefined) params.rev = rev;
			var path = '/fileops/copy/';
			post(buildUrl(path, params), cb);
		},

		//@todo caching
		metadata: function(fromPath, cb) { //, fileLimit, list) {
			var params = {};
			var path = '/metadata/' + root + '/' + qs.escape(fromPath);
			get(buildUrl(path, params), cb);
		}
	};
};