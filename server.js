'use strict';
// Call https://infinite-harbor-6139.herokuapp.com/api/challenge?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsInRhc2siOiJjaGFsbGVuZ2UifQ.eyJUYXNrIjoiQ2hhbGxlbmdlIiwiQ29tcGFueSI6Ik1pOSIsImlhdCI6MTQ0NTI1ODIzMiwiZXhwIjoxNDUwNDQyMjMyLCJhdWQiOiJhY2NvdW50IGhvbGRlcnMiLCJpc3MiOiJNaTkiLCJzdWIiOiJTaG93cyJ9.VA1LBt6yLxRdwuA-Il8H02h-bkhTNeelWNwUTjQnS9y1u9E6jJFT0MOK19Z3uh8YdhwIuBn6wFP1qOSWRR845imUlavfD3tbWG77RlIaGB_aoCg1IihJihMhyHREeQjvICiK8u119w4lQO3HxeIfk5ykF48aCK4Baf_6R1fOeec

const compress = require('koa-compress'),
			logger = require('koa-logger'),
			koa = require('koa'),
			app = koa();
			
const config 	= require(__dirname+'/config.js'),
			apis = require('./routes/api');

// Logger
app.use(logger());

// API Routes
apis(app);

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(config.express.port);
  console.log('Mi9 Server listening on port ' + config.express.port);
}