/*!
 * Mi9 Code Challenge - config.js
 */

'use strict';

var version = require('./package.json').version;

module.exports = {
    env: process.env.NODE_ENV || 'development',
    express: {
        port: process.env.EXPRESS_PORT ||  8080
    },
	app:  {
		name: 'Mi9 Code Challenge',
	  	version: version,
    	key: 'Mi9',
	  	debug: process.env.NODE_ENV !== 'production'
	}
};