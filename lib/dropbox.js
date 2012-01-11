var request = require('request'),
	sign = require('oauth'),
	qs = require('querystring');
	
module.exports = function(options) {
	
	options = options || {};

	if (typeof options.appKey === 'undefined') throw new Error('Dropbox API App Key is required: https://api.dropbox.com/developers/apps');
	if (typeof options.appSecret === 'undefined') throw new Error('Dropbox API App Secret is required: https://api.dropbox.com/developers/apps');
	
	var root = options.route || 'sandbox',
		apiUrl = 'https://api.dropbox.com/1/',
		contentApiUrl = 'https://api-content.dropbox.com/1/';

	return {
		// Oauth calls
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
			if(oauth_callback) url = url + "&oauth_callback=" + oauth_callback;
			return url;
		},

		getAccessToken: function() {
			var req = {};
			req.url = apiUrl + 'oauth/access_token';
			req.form = qs.stringify(sign(options));
			request.post(req, function(err, res, resBody) {
				cb(res.statusCode, qs.parse(resBody));
			});
		},

		


	};
};