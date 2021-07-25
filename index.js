const express = require("express");
const path      = require('path');
const app = express();
const http    = require('http');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const userRoutes = require('./route/userRoutes');
const dotenv = require('dotenv');
var cors = require('cors')

dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWPRD);
const pug = require("pug");
const cookieParser = require("cookie-parser");
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());

app.use(cors());

app.use(express.json());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/users', userRoutes);

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}).then(() => console.log('connect successfull'));

app.listen(3000, () => {
  console.log("Server is now running!");
});
