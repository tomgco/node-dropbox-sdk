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

	var appKey = options.appKey,
		appSecret = options.appSecret,
		sign = oauth(options.appKey, options.appSecret);
	
	if (typeof sess.tokens === 'undefined') {
		sess.tokens = {
			access: {},
			request: {}
		};
		sess.authenticated = false;
	}

	return {
		// Oauth calls
		sign: sign,

		buildAuthHeader: function(o, req) {
			var header = 'OAuth ';
			if (req !== undefined) {
				delete o.oauth_token;
			}
			for (var key in o) {
				var value = o[key];
				header += key + '="' + value + '", ';
			}

			return header.substring(0, header.length - 2);
		},

		tokens: {
			access: sess.tokens.access,
			request: sess.tokens.request
		},

		authenticated: sess.authenticated,

		getToken: function() {
			// abstract token calls
		},

		/**
		*	@param {Function} cb callback
		*/
		getRequestToken: function(cb) {
			var that = this;
			var body = that.sign();
			var req = request.defaults({
				body: qs.stringify(body),
				headers: {
					'Authorization': this.buildAuthHeader(body, true)
				}
			});
			req.get(dropbox.apiUrl + dropbox.apiVersion + '/oauth/request_token', function(err, res, resBody) {
				that.tokens.request = qs.parse(resBody);
				cb(res.statusCode, that);
			});
		},

		/**
		*	@param {String} oauthCallback A url to redirect back to with the authorized request token
		*/
		getAuthorizeUrl: function(oauthCallback) {
			var url = "https://www.dropbox.com/1/oauth/authorize?oauth_token=" + this.tokens.request.oauth_token;
			if(oauthCallback) url = url + "&oauth_callback=" + oauthCallback;
			return url;
		},

		getAccessToken: function(cb) {
			var that = this;
			var body = that.sign(this.tokens.request);
			var req = request.defaults({
				body: qs.stringify(body),
				headers: {
					'Authorization': this.buildAuthHeader(body)
				}
			});
			req.get(dropbox.apiUrl + dropbox.apiVersion + '/oauth/access_token', function(err, res, resBody) {
				that.tokens.access = qs.parse(resBody);
				if (res.statusCode === 200) {
					that.authenticated = true;
					cb(200, that);
				} else {
					cb(res.statusCode, that);
				}
			});
		}
	};
};