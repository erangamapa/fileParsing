var mysql = require('mysql');
var async = require('async');
var config = require('../config');
var path = require('path');
var pool  = mysql.createPool({
  host     : config.dbUrl,
  user     : config.dbUser,
  password : config.dbPass,
  database : config.dbName
});
var exec = require('child_process').exec;


exports.findOrCreate = function(table, field, value, mainCallback){
	var dbConnection;
	async.waterfall([
		function(callback){
			var container = {};
			pool.getConnection(function(err, connection) {
				if(err){
					callback(err, null);
				}else{
					dbConnection = connection;
					callback(null, container);
				}
			});
		},
		function(container, callback){
			var sql = 'LOCK TABLE ' + table + ' WRITE, ' + table + ' AS ' + table + '1 READ';
			dbConnection.query(sql, function(err, results) {
				if(err){
					callback(err, null);
				}else{
					callback(null, container);
				}
			});
		},
		function(container, callback){
			var sql = mysql.format("SELECT * FROM " + table + " AS " + table + "1 WHERE ?? = ? LIMIT 1", [field, value]);
			dbConnection.query(sql, function(err, results) {
				if(err){
					callback(err, null);
				}else{
					if(results[0]){
						container.record = results[0];
					}
					callback(null, container);
				}
			});
		},
		function(container, callback){
			if(container.record){
				callback(null, container);
			}else{
				var sql = mysql.format("INSERT INTO ?? SET ?? = ?",  [table, field, value]);
				dbConnection.query(sql, function(err, result) {
					if(err){
						callback(err, null);
					}else{
						container.record = result;
						callback(null, container);
					}
				});
			}
		},
		function(container, callback){
			var sql = 'UNLOCK TABLES';
			dbConnection.query(sql, function(err, results) {
				if(err){
					callback(err, null);
				}else{
					callback(null, container);
				}
			});
		}
	], function (err, container) {
		dbConnection.release();
		if(err){
			mainCallback(err, null);
		}else{
			if(container.record.insertId){
				var returnData = {};
				returnData['id'] = container.record.insertId;
				returnData[field] = value;
				mainCallback(null, returnData);
			}else{
				mainCallback(null, container.record);
			}
		}    
	});
}


exports.insertRecord = function(table, data, mainCallback){
	var dbConnection;
	async.waterfall([
		function(callback){
			var container = {};
			pool.getConnection(function(err, connection) {
				if(err){
					callback(err, null);
				}else{
					dbConnection = connection;
					callback(null, container);
				}
			});
		},
		function(container, callback){
			dbConnection.query('INSERT INTO ' + table + ' SET ?', data, function(err, result) {
				if(err){
					callback(err, null);
				}else{
					container.record = result;
					callback(null, container);
				}
			});
		}
	], function (err, container) {
		dbConnection.release();
		if(err){
			mainCallback(err, null);
		}else{
			data['id'] = container.record.insertId;
			mainCallback(null, data);
		}    
	});
}

exports.insertBulk = function(table, data, columnDef, mainCallback){
	var dbConnection;
	async.waterfall([
		function(callback){
			var container = {};
			pool.getConnection(function(err, connection) {
				if(err){
					callback(err, null);
				}else{
					dbConnection = connection;
					callback(null, container);
				}
			});
		},
		function(container, callback){
			dbConnection.query('INSERT INTO ' + table + ' ' + columnDef + ' VALUES ?', data, function(err, result) {
				if(err){
					callback(err, null);
				}else{
					container.record = result;
					callback(null, container);
				}
			});
		}
	], function (err, container) {
		dbConnection.release();
		if(err){
			mainCallback(err, null);
		}else{
			mainCallback(null, container.record);
		}    
	});
}

exports.getOperationsRecords = function(mainCallback){
	var dbConnection;
	async.waterfall([
		function(callback){
			var container = {};
			pool.getConnection(function(err, connection) {
				if(err){
					callback(err, null);
				}else{
					dbConnection = connection;
					callback(null, container);
				}
			});
		},
		function(container, callback){
			var options = {sql: 'SELECT companies.name, operations.type, operations.status FROM operations LEFT JOIN companies ON operations.company = companies.id', nestTables: '_'};
			dbConnection.query(options, function(err, results) {
			  if(err){
					callback(err, null);
				}else{
					container.records = results;
					callback(null, container);
				}
			});
		}
	], function (err, container) {
		dbConnection.release();
		if(err){
			mainCallback(err, null);
		}else{
			mainCallback(null, container.records);
		}    
	});
}

exports.getRecordsFromTable = function(tableName, mainCallback){
	var dbConnection;
	async.waterfall([
		function(callback){
			var container = {};
			pool.getConnection(function(err, connection) {
				if(err){
					callback(err, null);
				}else{
					dbConnection = connection;
					callback(null, container);
				}
			});
		},
		function(container, callback){
			dbConnection.query('SELECT * FROM ' + tableName, function(err, results) {
			  if(err){
					callback(err, null);
				}else{
					container.records = results;
					callback(null, container);
				}
			});
		}
	], function (err, container) {
		dbConnection.release();
		if(err){
			mainCallback(err, null);
		}else{
			mainCallback(null, container.records);
		}    
	});
}

exports.setupDatabases = function(environment, callback){
	if(environment == "development"){
		var filePath = path.resolve(__dirname) + "/../resources/tables.sql";
		var command = 'mysql -u ' + config.dbUser + ' -p' + config.dbPass + ' < ' + filePath;
		exec(command, function(error, stdout, stderr) {
			if(stderr){
				callback(stderr, null);
			}else{
				callback(null, true);
			}
		});
	}else if(environment == "test"){
		var filePath = path.resolve(__dirname) + "/../tests/fixtures/testDatabaseSetup.sql";
		var command = 'mysql -u ' + config.dbUser + ' -p' + config.dbPass + ' < ' + filePath;
		exec(command, function(error, stdout, stderr) {
			if(stderr){
				callback(stderr, null);
			}else{
				callback(null, true);
			}
		});
	}
}
