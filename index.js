const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const bodyParser = require('body-parser');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.get('/api', (req, res) => {
    return res.json({ message: "api" });
})

app.use('/user', require('./router/users'));
app.use('/provider', require('./router/providers'));

const start = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
        .then(() => console.log('connected to DB'));
          
        app.listen(PORT, () => console.log(`server run on port ${PORT}`)); 
    }
    catch (error) {
        console.log(error);
    }
}

start();

