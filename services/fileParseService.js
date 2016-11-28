var databaseService = require('../services/databaseService');
var progressService = require('../services/progressService');

var path = require('path');
var _ = require('underscore');
var async = require('async');
var csv = require("fast-csv");


exports.parseFile = function(fileName, channelName, mainCallback){
	console.log('inside here');
	var lineCount = 0;
	var readLines = 0;
	csv
	.fromPath(path.resolve(__dirname) + "/../resources/" + fileName)
	.on("data", function(data){
		lineCount++;
	})
	.on("end", function(){
		progressService.sendMessage(channelName, 'linecount', lineCount);
		csv
		.fromPath(path.resolve(__dirname) + "/../resources/" + fileName)
		.on("data", function(data){
			parseAndSaveLine(data, channelName, function(err, results){
				readLines++;
				if(err != null){
					console.log('failed to parse line ' + readLines);
					console.log(err);
				}else{
					//console.log('parsed line ' + readLines);
				}
			});
		})
		.on("end", function(){
			console.log("done");
			mainCallback(null, {completed: true});
		});
	});
}

var parseAndSaveLine = function(data, channelName, mainCallback){
	var  categories = _.uniq(data[data.length - 1].split(';'));
	if(!validateData(data)){
		mainCallback("invalid data in line", null);
	}else{
		async.waterfall([
			function(callback){
				var container = {};
				container.operation = {type: data[1], status: data[2]};
				databaseService.findOrCreate('companies', 'name', data[0], function(err, result){
					if(err){
						callback(err, null);
					}else{
						container.operation.company = result.id;
						callback(null, container);
					}
				});
			},
			function(container, callback){
				databaseService.insertRecord('operations', container.operation, function(err, result){
					if(err){
						callback(err, null);
					}else{
						container.operation = result;
						callback(null, container);
					}
				});
			},
			function(container, callback){
				var opCatPairs = [];
				async.each(categories, function(item, callback2){
					databaseService.findOrCreate('categories', 'name', item, function(err, result){
						if(err){
							callback2(err);
						}else{
							opCatPairs.push([result.id,container.operation.id]);
							callback2();
						}
					});
				}, function(err){
					if(err){
						callback(err, null);
					}else{
						container.opCatPairs = opCatPairs;
						callback(null, container);
					}
				});
			},
			function(container, callback){
				databaseService.insertBulk('op_cat', [container.opCatPairs], '(category, operation)', function(err, result){
					if(err){
						callback(err, null);
					}else{
						container.bulkResult = result;
						callback(null, container);
					}
				});
			}
		], function (err, container) {
			if(err){
				mainCallback(err, null);
			}else{
				progressService.sendMessage(channelName, 'update', 1);
				mainCallback(null, container);
			}
		});
		
	}
	
}

function validateData(data){
	data.every(function(item){
		if(item.length == 0){
			return false;
		}
	});
	return true;
}

exports.parseAndSaveLine = parseAndSaveLine;