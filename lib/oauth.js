module.exports = function(appKey, appSecret) {
	var getSignature = function (r) {
		return encodeURIComponent(appSecret + '&' + r);
	};

	var getNonce = function(size) {
		var result = [];
		var charCode;
		var from = 48; // ascii code 48 '0'
		var to = 122; // 'Z'

		for (var i = 0; i < nonceSize; i++) {
			charCode = Math.floor(Math.random() * (to - from + 1) + from);
			result[i] = String.fromCharCode(charCode);
		}

		return result.join('');	
	};

	return function(options) {
		options = options || {};

		options.oauth_consumer_key = appKey;
		options.oauth_signature = getSignature(options.oauth_token_secret);
		options.oauth_timestamp = + Date.now();
		options.oauth_nonce = getNonce(32);
		options.oauth_signature_method = 'PLAINTEXT';
		options.oauth_version = '1.0';

		delete options.oauth_token_secret;
		delete options.uid;

	};
};