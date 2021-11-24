const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config()

const app = express();

app.use(express.json());

app.use('/', require('./router'));

const start = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
        .then(()=> console.log('connected to DB'));
          
        app.listen('3500', () => console.log('server work ')); 
    }
    catch (error) {
        console.log(error)
    }
}

start();

