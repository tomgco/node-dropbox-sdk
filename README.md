# node-dropbox-sdk [![Build Status](https://secure.travis-ci.org/tomgallacher/node-dropbox-sdk.png)](https://secure.travis-ci.org/tomgallacher/node-dropbox-sdk)

This is an alternative SDK for using the Dropbox API within node.js

## Installation

	$ npm install dropbox-sdk

## SDK

### Dropbox.client

See (https://www.dropbox.com/developers/reference/api) for more

`accountInfo(callback)`

`getFile(fromPath, callback)`

`putFile(toPath, file, callback)`

`metadata(fromPath, callback)`

`revisions(path, params, callback)`

`restore(path, rev, params, callback)`

`search(path, query, params, callback)`

`shares(path, callback)`

`media(path, callback)`

`thumbnails(path, size, callback)`

#### File Operations

`copy(fromPath, toPath, callback)`

`createFolder(path, callback)`

`del(fromPath, callback)`

`move(fromPath, toPath, callback)`


### Dropbox.session

`getRequestToken(callback)`

`getAuthorizeUrl(oauthCallback)`

`getAccessToken(callback)`

### Usage

The first thing you have to do is find your app key and secret pair. As described in the [Getting Started](https://www.dropbox.com/developers/start) guide, the app key and secret are used to authenticate a Dropbox session and must be included with every API call. You can find these keys in the [Setup tutorial](https://www.dropbox.com/developers/start/setup) or via the [My Apps](https://www.dropbox.com/developers/apps) section of the Dropbox website. Once you have your keys, we'll use them to access your Dropbox account and the Dropbox API.

#### Creating a session object

To create a dropbox session you need to pass in an object that contains `appKey` & `appSecret` it is best practise to place this object in a new module that you then require.

`dropbox-config.js`
		// Get your app key and secret from the Dropbox developer website
		module.exports = {
		  appKey: 'your-app-key',
		  appSecret: 'your-app-secret'
		};

`app.js`
		// This includes the dropbox-sdk module
		var dropboxSDK = require('dropbox-sdk'),
			config = require('./dropbox-config');

		// `sess` sould be your frameworks session object
		var session = new Dropbox.session(config, sess);

#### Get a request token
Now we're all set to start authenticating. We'll start by using the session object to get a request token via the `getRequestToken` SDK method.
		session.getRequestToken(function(status, reply) {
			// That's all there is to it. The SDK automatically attaches your new request token to your session object.
		});

#### User authentication and authorization
With a request token in hand, it's time for the user to authorize our app. To do this, we'll send the user to the Dropbox website to allow your app access to their Dropbox account. The request token is passed to `getAuthorizeUrl` to create a unique authorization URL to send the user to and, optionally, specify the website to return the user to after they finish granting access to your app.

		res.redirect(session.getAuthorizeUrl('http://' + req.headers.host + '/auth'));

#### Get an access token
Once the user has successfully granted permission to your app, we can upgrade the now-authorized request token to an access token. We'll do that by passing the request token via `getAccessToken`.

		session.getAccessToken(function(status, reply){
			res.redirect('/');
		});

The access token is all you'll need for all future API requests on behalf of this user, so you should store it away for safe-keeping (even though we don't for this tutorial). By storing the access token, you won't need to go through these steps again unless the user reinstalls your app or revokes access via the Dropbox website.

Now that the hard part is done, all you'll need to sign your other API calls is to to pass the session object to `Dropbox.client`.

## License

(The MIT License)

Copyright (c) 2011 Tom Gallacher &lt;<http://tomg.co>&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.