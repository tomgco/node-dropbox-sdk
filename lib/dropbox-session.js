var request = require('request'),
	sign = require('oauth'),
	qs = require('querystring'),
	dropbox = require('dropbox');
	
module.exports = function(options) {
	
	options = options || {};

	if (typeof options.appKey === 'undefined') throw new Error('Dropbox API App Key is required: https://api.dropbox.com/developers/apps');
	if (typeof options.appSecret === 'undefined') throw new Error('Dropbox API App Secret is required: https://api.dropbox.com/developers/apps');
	
	var accessToken = {},
		requestToken = null;

	return {
		// Oauth calls

		/**
		*	@param {Function} cb callback
		*/
		getRequestToken: function(cb) {
			var req = {};
			req.url = apiUrl + 'oauth/request_token';
			req.form = qs.stringify(sign());
			request.post(req, function(err, res, resBody) {
				cb(res.statusCode, qs.parse(resBody));
			});
		},

		/**
		*	@param {Object} requestToken A request token from getRequestToken
		*	@param {String} oauthCallback A url to redirect back to with the authorized request token
		*/
		getAuthorizeUrl: function(requestToken, oauthCallback) {
			var url = "https://www.dropbox.com/1/oauth/authorize?oauth_token=" + requestToken.oauth_token;
			if(oauthCallback) url = url + "&oauth_callback=" + oauthCallback;
			return url;
		},

		getAccessToken: function(options, cb) {
			var req = {};
			req.url = apiUrl + 'oauth/access_token';
			req.form = qs.stringify(sign(options));
			request.post(req, function(err, res, resBody) {
				if (statusCode === 200) accessToken = qs.parse(resBody);
				cb(res.statusCode, qs.parse(resBody));
			});
		},

		get: function(url, cb) {
			var req = request.defaults({
				headers: {
					'Authorization': qs.stringify(sign(accessToken)),
					'User-Agent': 'node.jsSDK/TomGallacher'
				}
			});
			req.get(url, function(err, res, resBody) {
				cb(res.statusCode, qs.parse(resBody));
			});
		},

		put: function(url, file, cb) {
			var req = request.defaults({
				headers: {
					'Authorization': qs.stringify(sign(accessToken)),
					'User-Agent': 'node.jsSDK/TomGallacher'
				},
				body: file
			});
			req.put(url, function(err, res, resBody) {
				cb(res.statusCode, qs.parse(resBody));
			});
		}
	};
};