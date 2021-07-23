const express = require("express");
const app = express();
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWPRD);


mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}).then(() => console.log('connect successfull'));

app.listen(3000, () => {
  console.log("Server is now running!");
});
