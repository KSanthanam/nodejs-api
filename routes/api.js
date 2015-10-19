/*!
 * Mi9 Code Challenge - routes.js
 */
'use strict';
const Router = require('koa-router');

const filter 	= require(__dirname+'/../controllers/filter.js')(),
 			auth 	= require(__dirname+'/../controllers/auth.js')();

module.exports 	= function routes(app) {

	// Unsecured routes
	const unauth = new Router();
	unauth.post('/challenge', filter.filterShows);
	app.use(unauth.routes());

	// Require authentication for now onwards
	app.use(auth.isAuthenticated);

	// Secured Routes
	const secured = new Router();
	secured.post('/api/challenge', filter.filterShows);
	app.use(secured.routes())

};