var expect    = require("chai").expect;
var config = require("../config");
var async = require('async');
var sinon = require('sinon');
var databaseService = require('../services/databaseService');
var fileParseService = require('../services/fileParseService');
var progressService = require('../services/progressService');


describe("testing file parse functions", function() {
	this.timeout(15000);
	before(function (done) {
		sinon.stub(databaseService, 'findOrCreate', function(table, field, value, mainCallback){
            setTimeout(function () {
            	var retVal;
            	switch (value) {
            		case "MyCompany1":
            			retVal = {id: 31, name: "MyCompany1"}
            			break;
            		case "food":
            			retVal = {id: 17, name: "food"}
            			break;
            		case "drugs":
            			retVal = {id: 15, name: "drugs"}
            			break;
            		default:
            			retVal = {};
            			break;
            	}
                mainCallback(null, retVal);
            }, 0);
        });
        sinon.stub(databaseService, 'insertRecord', function(table, data, mainCallback){
            setTimeout(function () {
            	data['id'] = 112;
                mainCallback(null, data);
            }, 0);
        });
        sinon.stub(databaseService, 'insertBulk', function(table, data, columnDef, mainCallback){
            setTimeout(function () {
            	data['id'] = 112;
                mainCallback(null, {affectedRows: 2});
            }, 0);
        });
        sinon.stub(progressService, 'sendMessage', function(channelName, event, value){
            
        });
        done();
	});


	it('should fetch existing company record', function(done) {
		var line = "MyCompany1,delivery,accepted,food;drugs";
		fileParseService.parseAndSaveLine(line.split(','), "testChannel_1", function(err, result){
			if(err){
				done(err);
			}else{
				console.log(result);
				expect(result).to.exist;
				done();
			}
		});
    });


});

describe("testing file parse functions", function(){
	this.timeout(15000);
	it('should parsed all the lines and add to database in the given file', function(done) {
		sinon.stub(progressService, 'sendMessage', function(channelName, event, value){
            
        });
		fileParseService.parseFile("operationsData.csv", 10, function(err, result){
			if(err){
				done(err);
			}else{
				console.log(result);
				expect(result.completed).to.equal(true);
				setTimeout(function(){
					done();
				}, 10000);
			}
		});
    });
});