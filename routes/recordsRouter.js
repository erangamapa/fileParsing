var express = require('express');
var recordsRouter = express.Router();
var databaseService = require('../services/databaseService');

recordsRouter.get('/getOperationsRecords', function(req, res, next) {
	databaseService.getOperationsRecords(function(err, results){
		if(err){	
			next(err);
		}else{
			res.send(results);
		}
	});
});

recordsRouter.get('/getCompanyRecords', function(req, res, next) {
	databaseService.getRecordsFromTable('companies', function(err, results){
		if(err){	
			next(err);
		}else{
			res.send(results);
		}
	});
});

module.exports = recordsRouter;
