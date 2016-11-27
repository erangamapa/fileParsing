# fileParsing

--Prerequisite--

Before running this application, you need to install mysql and create two databases.
One is for unit testing and other one is for the application. After that you have
to fill in your database details inside config.js file under respective environment. 


--Running Application--

First do an npm install. After that you have to execute tables.sql to your database.
Then you can run the following command.

NODE_ENV=<env-type> npm start
env-type would be development, test or production as in config.js
For development NODE_ENV=development npm start

After that you have to load the application at http://localhost:3000
In order to upload the file, you can use the sampleFile.csv provided inside resources folder.


-- Unit Tests --

Unit tests are created based on mocha with chai assertions and sinon stubs.
Before running unit tests related to database service, you need to run testDatabaseSetup.sql inside
fixtures folder in tests. For file parse service, you do not need to populate database. 


--NOTE---
Application is based on nodejs, mysql, Jade and Jquery.

I have created four database tables as companies, operations, categories and
operations to category table in order to maintain many to many relationship.
Unit testing is based on chai.

File parsing operations are implimented such that they execute asynchronously.
By uploading a large file in given format will show a better parse progress bar.
