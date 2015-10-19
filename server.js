'use strict';

const compress = require('koa-compress'),
			logger = require('koa-logger'),
			koa = require('koa'),
			app = koa();
			
const config 	= require(__dirname+'/config.js'),
			apis = require('./routes/api');

// Logger
app.use(logger());

apis(app);

// Compress
app.use(compress());

if (!module.parent) {
/*	
	let cert = fs.readFileSync('challenge.rsa');
	let token = jwt.sign({ Task: 'Challenge', Company: 'Mi9' }, cert, { 
		algorithm: 'RS256', 
		expiresIn: '60d', 
		audience: 'account holders',
		subject: 'Shows',
		issuer: 'Mi9',
		headers: {task: 'challenge'}
	});
	console.log(token);
*/	
  app.listen(config.express.port);
  console.log('Mi9 Server listening on port 3000');
}