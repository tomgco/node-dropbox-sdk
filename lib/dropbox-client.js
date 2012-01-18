var request = require('request'),
	qs = require('querystring'),
	dropbox = require('./dropbox'),
	_ = require('underscore');

module.exports = function(dropboxSession, root) {
	root = root || 'sandbox';

	var buildUrl = function(url, params, contentServer) {
		var host = contentServer ? dropbox.contentApiUrl : dropbox.apiUrl;
		return host + dropbox.apiVersion + url + qs.stringify(params);
	};

	var defaultHeader = {
		'Authorization': dropboxSession.buildAuthHeader(dropboxSession.sign(dropboxSession.tokens.access))
	};

	/**
	*	Requests options for overloading default options.
	*/
	var get = function(url, options, cb) {
		var req = request.defaults(options);
		req.get(url, function(err, res, resBody) {
			cb(res.statusCode, resBody);
		});
	};

	var put = function(url, headers, body, cb) {
		var header = {};
		_.defaults(header, defaultHeader, headers);
		var req = request.defaults({
			headers: header,
			body: body
		});
		req.put(url, function(err, res, resBody) {
			cb(res.statusCode, resBody);
		});
	};

	var post = function(url, headers, body, cb) {
		var header = {};
		if (body !== null) {
			body = { 'body': body };
		} else {
			body = {};
		}
		_.defaults(header, defaultHeader, headers);
		var req = request.defaults({
			headers: header,
			body: body
		});
		req.post(url, function(err, res, resBody) {
			cb(res.statusCode, resBody);
		});
	};

	return {

		accountInfo: function(cb) {
			get(buildUrl('/account/info'), {}, cb);
		},

		getFile: function(fromPath, cb) { //, rev, cb) {
			var params = {};

			var path = '/files/' + root + '/' + qs.escape(fromPath);
			get(buildUrl(path, params, true), {}, cb);
		},

		putFile: function(toPath, file, cb) {
			var params = params || {};
			var path = '/files_put/' + root + '/' + qs.escape(toPath);
			put(buildUrl(path, params, true), {
				"Content-Type": "application/octet-stream",
				"Content-Length": file.length
				}, file, cb);
		},

		//@todo caching
		metadata: function(fromPath, cb) { //, fileLimit, list) {
			var params = {};
			var path = '/metadata/' + root + '/' + qs.escape(fromPath);
			get(buildUrl(path, params), {}, cb);
		},

		revisions: function(path, params, cb) {
			params = params || {};
			params.root = root;
			params.path = path;
			params.rev_limit = params.rev_limit || 1000;

			path = '/files/' + root + '/' + qs.escape(path);
			get(buildUrl(path, params, true), {}, cb);
		},

		restore: function(path, rev, params, cb) {
			params = params || {};
			params.root = root;
			params.path = fromPath; // escape
			params.rev = rev;

			path = '/restore/' + root + '/' + qs.escape(path);
			post(buildUrl(path, params), {}, null, cb);
		},

		search: function(path, query, params, cb) {
			params = params || {};
			params.query = query;
			params.file_limit = params.file_limit || 1000;
			params.include_deleted = params.include_deleted || false;

			path = '/files/' + root + '/' + qs.escape(fromPath);
			get(buildUrl(path, params, true), {}, cb);
		},

		shares: function(path, cb) {
			var params = {};
			path = '/shares/' + root + '/' + qs.escape(path);
			get(buildUrl(path, params), {}, cb); // get().end()? flow control
		},

		media: function(path, cb) {
			var params = {};
			path = '/media/' + root + '/' + qs.escape(path);
			get(buildUrl(path, params), {}, cb);
		},

		thumbnails: function(path, size, cb) {
			var params = {};
			params.size = size;
			path = '/thumbnails/' + root + '/' + qs.escape(path);
			get(buildUrl(path, params, true), { encoding: 'binary' }, cb); // get().end()? flow control
		},

		copy: function(fromPath, toPath, cb) { //, rev, cb) {
			var params = {};
			params.from_path = fromPath; // escape
			params.to_path = toPath;

			var path = '/fileops/copy/';
			post(buildUrl(path, params), {}, null, cb);
		},

		createFolder: function(path, cb) {
			var params = {};
			params.root = root; // escape
			params.path = path;

			path = '/fileops/create_folder/'; // uri
			post(buildUrl(path, params), {}, null, cb);
		},

		del: function(fromPath, cb) { //, rev, cb) {
			var params = {};
			params.root = root;
			params.path = fromPath; // escape

			var path = '/fileops/delete/';
			post(buildUrl(path, params), {}, null, cb);
		},

		move: function(fromPath, toPath, cb) {
			var params = {};
			params.from_path = fromPath; // escape
			params.to_path = toPath;

			var path = '/fileops/move/';
			post(buildUrl(path, params), {}, null, cb);
		}
	};
};