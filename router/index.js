const express = require('express');
const User = require('../models/User');
const router = express.Router();
const url = require('url');

router.get('/one', async (req, res) => {
    const find = url.parse(req.url, true).query
    const user = await User.findOne({ username: find.username });
    return res.json(user); 
});

router.get('/all', async (req, res)=> {
    const find = await User.find();
    return res.json(find);
});

router.get('/api', (req, res) => {
    return res.json('message')
})

router.post('/user', (req, res) => {
    console.log(req.body)
    const user = new User({ username: req.body.username, password: req.body.password })
    user.save();
    return res.json(user)
})

module.exports = router;