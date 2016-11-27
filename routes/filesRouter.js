var express = require('express');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var fileParseService = require('../services/fileParseService');
var path = require('path');
var fs = require('fs');

var filesRouter = express.Router();
filesRouter.use(bodyParser.json());
filesRouter.use(fileUpload());

filesRouter.post('/uploadFile', function(req, res, next) {
	var sampleFile;
 
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
    sampleFile = req.files.sampleFile;
    sampleFile.mv(path.resolve(__dirname) + "/../resources/" + sampleFile.name, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.render('parseFile', {uploadedFileName: sampleFile.name});
        }
    });
});

filesRouter.post('/parseFile', function(req, res, next) {
	var channelName = req.query.channelName;
	var fileName = req.query.fileName;
	console.log(channelName);
	console.log(fileName);
	fileParseService.parseFile(fileName, channelName, function(err, result){
		if(err){
			console.log(err);
		}else{
			console.log('Parsing started');
			res.send({message:'Parsing started'});
		}
	});
});

module.exports = filesRouter;
