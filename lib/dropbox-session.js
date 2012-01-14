var request = require('request'),
	oauth = require('./oauth'),
	qs = require('querystring'),
	dropbox = require('./dropbox');

/**
 * @params sess mutable session object provided by framework e.g expressjs
 */
module.exports = function(options, sess) {
	options = options || {};

	if (typeof options.appKey === 'undefined') throw new Error('Dropbox API App Key is required: https://api.dropbox.com/developers/apps');
	if (typeof options.appSecret === 'undefined') throw new Error('Dropbox API App Secret is required: https://api.dropbox.com/developers/apps');

	var sign = oauth(options.appKey, options.appSecret),
		appKey = options.appKey,
		appSecret = options.appSecret;


	if (typeof sess.tokens === 'undefined') {
		sess.tokens = {
			access: {},
			request: {}
		};
	}

	sess.authenticated = false;

	return {
		// Oauth calls
		sign: sign,

		token: sess.tokens.request,
		/**
		*	@param {Function} cb callback
		*/
		getRequestToken: function(cb) {
			var req = request.defaults({
				body: qs.stringify(sign()),
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				}
			});
			req.post(dropbox.apiUrl + dropbox.apiVersion + '/oauth/request_token', function(err, res, resBody) {
				sess.tokens.request = qs.parse(resBody);
				cb(res.statusCode, sess);
				// console.log(sess.dropbox.tokens.request);
			});
		},

		/**
		*	@param {String} oauthCallback A url to redirect back to with the authorized request token
		*/
		getAuthorizeUrl: function(oauthCallback) {
			console.log("https://www.dropbox.com/1/oauth/authorize?oauth_token=" + sess.tokens.request.oauth_token)
			var url = "https://www.dropbox.com/1/oauth/authorize?oauth_token=" + sess.tokens.request.oauth_token;
			if(oauthCallback) url = url + "&oauth_callback=" + oauthCallback;
			return url;
		},

		getAccessToken: function(cb) {
			// console.log(qs.stringify(sign(sess.dropbox.tokens.request)));
			var req = request.defaults({
				body: qs.stringify(sign(sess.tokens.request)),
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				}
			});
			req.post(dropbox.apiUrl + dropbox.apiVersion + '/oauth/access_token', function(err, res, resBody) {
				sess.tokens.access = qs.parse(resBody);
				if (res.statusCode === 200) sess.authenticated = true;
				cb(res.statusCode, sess);
			});
		}
	};
};