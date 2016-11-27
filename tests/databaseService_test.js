var expect    = require("chai").expect;
var config = require("../config");
var async = require('async');
var databaseService = require('../services/databaseService');
var execsql = require('execsql');

describe("testing database functions", function() {
	this.timeout(15000);
	it('should fetch existing company record', function(done) {
		databaseService.findOrCreate('companies', 'name', 'google', function(err, result){
			if(err){
				done(err);
			}else{
				expect(result).to.exist;
				expect(result.id).to.equal(1);
				expect(result.name).to.equal('google');
				done();
			}
		});
    });
    it('should create new company record and return its id', function(done) {
		databaseService.findOrCreate('companies', 'name', 'paypal', function(err, result){
			if(err){
				done(err);
			}else{
				expect(!isNaN(result.id)).to.equal(true);
				expect(result.name).to.equal('paypal');
				done();
			}
		});
    });
    it('should fetch existing category record', function(done) {
		databaseService.findOrCreate('categories', 'name', 'finance', function(err, result){
			if(err){
				done(err);
			}else{
				expect(result).to.exist;
				expect(result.id).to.equal(5);
				expect(result.name).to.equal('finance');
				done();
			}
		});
    });
    it('should create new category record and return its id', function(done) {
		databaseService.findOrCreate('categories', 'name', 'security', function(err, result){
			if(err){
				done(err);
			}else{
				expect(!isNaN(result.id)).to.equal(true);
				expect(result.name).to.equal('security');
				done();
			}
		});
    });
    it('should create new operations record and return its id', function(done) {
    	var operationsData = {company: 5, type: 'replacement', status: 'approved'};
		databaseService.insertRecord('operations', operationsData, function(err, result){
			if(err){
				done(err);
			}else{
				expect(!isNaN(result.id)).to.equal(true);
				done();
			}
		});
    });
    it('should create new operations to categories (many to many) data and return created data', function(done) {
    	var manyToManyData = [[1,4],[6,4]];
		databaseService.insertBulk('op_cat', [manyToManyData], '(category, operation)', function(err, result){
			if(err){
				done(err);
			}else{
				expect(err).to.equal(null);
				expect(result.affectedRows).to.equal(2);
				done();
			}
		});
    });
});