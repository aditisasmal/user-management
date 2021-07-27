const express = require("express");
const path      = require('path');
const app = express();
const http    = require('http');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const userRoutes = require('./route/userRoutes');
const dotenv = require('dotenv');
var cors = require('cors')
var flash    = require('connect-flash');
dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWPRD);
const pug = require("pug");
const cookieParser = require("cookie-parser");
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(cookieParser());
app.use(flash()); 
app.use(cors());

app.use(express.json());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
	response.render('login.html');
});
app.get('/profile', function(request, response) {
	response.render('profile.html');
});

app.use('/api/v1/users', userRoutes);

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}).then(() => console.log('connect successfull'));

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port");
});
