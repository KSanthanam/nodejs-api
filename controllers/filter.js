/*!
 * Mi9 Code Challenge - routes.js
 */
'use strict';
'use strict';
const debugmodule = 'nodejs-api',
			debugcontext = '',
			debugsubmodule = ':routes';

const debug = require('debug')(debugmodule + debugcontext + debugsubmodule),
			debugParam = require('debug')(debugmodule + ':param' + debugsubmodule),			
			fs = require('fs'),
			jwt = require('jsonwebtoken'),
			parse = require('co-body');

const config 	= require(__dirname+'/config.js');

module.exports = function() {
  return {
  	filterShows: filterShows,
  	secFilterShows: secFilterShows
  };
};

var filterShows = function *(next) {
	let ctx = this;
  let shows = yield parse(ctx);
  try {
  	let payload = getPayload(shows, true);
  	let response = [];

		payload.map(function (show) {
			if (config.filter.condition(show)) response.push({
																										image: show.image.showImage,
																										slug: show.slug,
																										title: show.title
																									});
		});

		ctx.body = { 
			response: response
		};
	} catch (error) {
		debug(error.message);
		ctx.status = 400;				
		ctx.body = { 
			error: "Could not decode request: JSON parsing failed"
		};				
	}
};


var secFilterShows = function *(next) {
	let ctx = this;
  let shows = yield parse(ctx);
  try {
	  let query = ctx.request.query;

	  let valid = yield* validate(query);
	  if (!valid) throw new Error('Invalid token');

  	let payload = getPayload(shows, true);
  	let response = [];

		payload.map(function (show) {
			if (config.filter.condition(show)) response.push({
																										image: show.image.showImage,
																										slug: show.slug,
																										title: show.title
																									});
		});

		ctx.body = { 
			response: response
		};
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

var getPayload = function getPayload(shows, integrityCheck) {
	let payload;

	if (shows.payload == undefined) {
		debugParam("No data given");
		throw new Error("No data given");		
	}

	integrityCheck = (integrityCheck == undefined) ? false : integrityCheck;

	// payload
	if (shows.payload == undefined) {
		payload = [];
	} else {
		payload = shows.payload;
	}

	if (payload.length == 0) {
		throw new TypeError(payload + 'is Empty')
	} 

	let missingflds = [];
	let missing = payload.map(function (show) {
													return config.filter.fields.map(function (field) {
																					if (show[field] == undefined) missingflds.push(field);
																					return (show[field] == undefined);
																				}).reduce(function (left, right) {
																					return (left || right);
																				}, false);
												}).reduce(function (left, right) {
													return (left || right);
												});

	if (missing) {
		debugParam('Missing fields are %j', missingflds);
	}
	if (integrityCheck && missing) {
		debugParam("Missing fields in the input");
		throw new Error("Missing fields in the input")
	}
	return payload;
};

