module.exports = function(token, tokenSecret) {

	var getSignature = function(r) {
		return tokenSecret + '&' + encodeURIComponent(r);
	};

	var getNonce = function(size) {
		var result = [];
		var charCode;
		var from = 48; // ascii code 48 '0'
		var to = 122; // 'Z'

		for (var i = 0; i < size;) {
			charCode = Math.floor(Math.random() * (to - from + 1) + from);
			if ((charCode > 47 && charCode < 57) ||
			(charCode > 65 && charCode < 91) ||
			(charCode > 96 && charCode < 123)) {
				result[i] = String.fromCharCode(charCode);
				i++;
			}
		}

		return result.join('');
	};

	return function(options) {
		options = options || {};

		var secret = options.oauth_token_secret || '';

		options.oauth_consumer_key = token;
		options.oauth_signature = getSignature(secret);
		options.oauth_timestamp = (Math.floor(Date.now() / 1000)).toString();
		options.oauth_nonce = getNonce(18);
		options.oauth_signature_method = 'PLAINTEXT';
		options.oauth_version = '1.0';

		delete options.oauth_token_secret;
		delete options.uid;

		return options;
	};
};