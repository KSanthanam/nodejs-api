/*!
 * Mi9 Code Challenge - routes.js
 */
'use strict';
const debugmodule = 'nodejs-api',
			debugcontext = '',
			debugsubmodule = ':auth';

const debug = require('debug')(debugmodule + debugcontext + debugsubmodule),
			debugParam = require('debug')(debugmodule + ':param' + debugsubmodule),			
			fs = require('fs'),
			jwt = require('jsonwebtoken'),
			parse = require('co-body');

const config 	= require(__dirname+'/config.js');

module.exports = function() {
  return {
  	isAuthenticated: isAuthenticated
  };
};



var isAuthenticated = function *(next) {
	let ctx = this;
  try {
	  let query = ctx.request.query;

	  let authenticated = yield* validate(query);

	 	if (authenticated) {
	    yield next;
	  } else {
			ctx.status = 400;				
			ctx.body = { 
				error: "Could not decode request: JSON parsing failed"
			};				
	  }
	} catch (error) {
		debug(error.message);
		ctx.status = 400;				
		ctx.body = { 
			error: "Could not decode request: JSON parsing failed"
		};				
	}
};

var validate = function*(query) {
	if (query.access_token == undefined) {
		debugParam("No access token given");
		throw new Error("No access token given");				
	}
	try {
		let token = query.access_token;

		// Check Algorithm - This is a fix for a jwt vulnerability 
		let cert = fs.readFileSync('challenge.rsa.pub'); // get public key 
		let decoded = yield jwt.verify(token, cert, { 
								algorithms: ['RS256'], audience: 'account holders',
								subject: 'Shows',
								issuer: 'Mi9',
								headers: {task: 'challenge'} });
		debug('Decoded %j', decoded);
		return true;
	} catch (error) {
		throw new Error(error.message);		
	}
	return false;

};
