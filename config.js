/*!
 * Mi9 Code Challenge - config.js
 */

'use strict';

var version = require('./package.json').version;

module.exports = {
    env: process.env.NODE_ENV || 'development',
    express: {
        port: process.env.PORT ||  3000
    },
	app:  {
		name: 'Mi9 Code Challenge',
	  	version: version,
    	key: 'Mi9',
	  	debug: process.env.NODE_ENV !== 'production'
	}
};