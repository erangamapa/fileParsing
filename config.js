var config;

if (process.env.NODE_ENV == 'production') {
    console.log('running on production');
    config = {
    	'dbUrl': '<prod_db_url>',
    	'dbUser': 'root',
    	'dbPass': 'ABC',
    	'dbName': 'companyAppProd'
    };
} else if (process.env.NODE_ENV == 'development') {
    console.log('running on development');
    config = {
    	'dbUrl': 'localhost',
    	'dbUser': 'root',
    	'dbPass': 'ABC',
    	'dbName': 'companyApp'
    };
} else if (process.env.NODE_ENV == 'test') {
    console.log('running on test');
    config = {
    	'dbUrl': 'localhost',
    	'dbUser': 'root',
    	'dbPass': 'ABC',
    	'dbName': 'companyAppTest'
    };
}

module.exports = config;