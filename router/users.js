const express = require('express');
const User = require('../models/User');
const router = express.Router();
const url = require('url');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const auth = require('../middleware/authMid');

router.get('/one', auth, async (req, res) => {
    const find = url.parse(req.url, true).query;
    try {
        const user = await User.findOne({email: req.user.email});
        return res.json({
            error: [],
            data: {
                user: user.username,
                email: user.email,
                id: user._id
            }
        }); 
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.get('/all', auth, async (req, res) => {
    try {
        const find = await User.find();
        return res.json(find);
    } catch (error) {
        return res.status(403).json({ error });
    }
});

router.post('/signup',
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({ min: 5 }).withMessage('password to short'),
    async (req, res) => {
        const { username, password, email } = req.body;
        const validator = validationResult(req);

    if(!validator.isEmpty()) {
        const error = validator.array().map(error => ({ msg: error.msg, param: error.param }));
            return res.json({ error });
    }
    try { 
    const candidate = await User.findOne({ username });
    if(candidate) {
        return res.status(400).json({
            msg: 'user already exist'
        });
    }
    //hash password and save in DB
    const hashPassword = bcrypt.hashSync(password, 6);
    const newUser = new User({ username, password: hashPassword, email });
    await newUser.save();

    //JWT
    const token = JWT.sign({ email: newUser.email }, process.env.SECRET_KEY, { expiresIn: 360000 });
    return res.status(200).json({
        error: [],
        data: { token, user: { id: newUser._id, email: newUser.email } }
        });   
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'something is going wrong' });
    }
});

router.post('/login', async (req, res) => {
    const { password, email } = req.body;

    try {
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(400).json({
                error: [{ msg: 'invalids credentials' }],
                data: null
            });
    } 
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({
            error:
            [{ msg: 'invalid password' }],
            data: null });
    } 
    const token = JWT.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: 360000 });
        return res.status(200).json({
            error: [], 
            data: { token, user: { id: user._id, email: user.email }}});  
    } catch (error) {
        return res.status(400).json({ error: 'invalid password or email'});
    }
});

module.exports = router;