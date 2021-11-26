const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
    return res.json({ message: "api" })
})

app.use('/user', require('./router/users'));
app.use('/provider', require('./router/providers'));

const start = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
        .then(()=> console.log('connected to DB'));
          
        app.listen('3500', () => console.log('server work ')); 
    }
    catch (error) {
        console.log(error);
    }
}

start();

