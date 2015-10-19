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
  	filterShows: filterShows // filter Shows 
  };
};

var filterShows = function *(next) {
	let ctx = this;
  try {

	  let shows = yield parse(ctx); // parse the post in the body.
  	let payload = getPayload(shows, true); // Validate & Sanitize the payload

  	let response = [];

		payload.map(function (show) {
			if (config.filter.condition(show)) response.push({
																										image: show.image.showImage,
																										slug: show.slug,
																										title: show.title
																									});
		}); // map the pay load to filter conditions set in the config

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
																					if (show[field] == undefined) missingflds.push(field); // Track missing fields
																					return (show[field] == undefined); // return true for missing fields
																				}).reduce(function (left, right) {
																					return (left || right);
																				}, false); // check there is no missing fields
												}).reduce(function (left, right) {
													return (left || right);
												}); // Ensure no show has missing fields

	if (missing) { // There is a missing field
		debugParam('Missing fields are %j', missingflds);
	}

	if (integrityCheck && missing) { // Integrity Check needed and there is at least one missing field
		throw new Error("Missing fields in the input")
	}
	return payload;
};