/*!
 * Mi9 Code Challenge - routes.js
 */
'use strict';
const Router = require('koa-router');

const filter 	= require(__dirname+'/../controllers/filter.js')();

module.exports 	= function routes(app) {
	const unauth = new Router();
	unauth.post('/challenge', filter.filterShows);
	app.use(unauth.routes())
	const secured = new Router();
	secured.post('/api/challenge', filter.secFilterShows);
	app.use(secured.routes())

};