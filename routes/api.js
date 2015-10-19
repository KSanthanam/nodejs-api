/*!
 * Mi9 Code Challenge - routes.js
 */
'use strict';
const Router = require('koa-router');

const filter 	= require(__dirname+'/../controllers/filter.js')(),
		 	auth 	= require(__dirname+'/../controllers/auth.js')();

module.exports 	= function routes(app) {

	// Unauthorised routes
	const unauth = new Router();
	unauth.post('/', filter.filterShows);
	app.use(unauth.routes());

	// Require authentication for now
	app.use(auth.isAuthenticated);


	// Authorised routes
	const secured = new Router();
	secured.post('/api/challenge', filter.filterShows);
	app.use(secured.routes())
};