const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const container = require('./container');
const passport = require('passport');

container.resolve(function(users, _) {

	mongoose.Promise = global.Promise;

	mongoose.connect('mongodb://localhost/footballkik', { useMongoClient:true });

	const app = setupExpress();

	function setupExpress(){
		const app = express();
		const server = http.createServer(app);
		server.listen(3080, () => {
			console.log('Listening on port 3080');
		});
		ConfigureExpress(app);

		const router = require('express-promise-router')();
		users.SetRouting(router);
		app.use(router);
	}

	function ConfigureExpress(app){
		require('./passport/passport-local');
		require('./passport/passport-facebook');
		app.use(express.static('public'));
		app.use(morgan('dev'));
		app.use(cookieParser());
		app.set('view engine', 'ejs');
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(validator());
		app.use(session({
			secret:'fullmetal%$@&',
			resave: true,
			saveUninitialized: false,
			store: new MongoStore({ mongooseConnection: mongoose.connection})
		}))
		app.use(flash());
		app.use(passport.initialize());
		app.use(passport.session());
		app.locals._ = _;
	}

});
