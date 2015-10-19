/*!
 * Mi9 Code Challenge - routes.js
 */
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
  	filterShows: filterShows
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

