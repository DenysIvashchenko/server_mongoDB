const express = require('express');
const User = require('../models/User');
const router = express.Router();
const url = require('url');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const auth = require('../middleware/authMid')

router.get('/one', async (req, res) => {
    const find = url.parse(req.url, true).query;
    try {
        const user = await User.findOne({ username: find.username });
        return res.json(user); 
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.get('/all', auth, async (req, res)=> {
    try {
        const find = await User.find();
        return res.json(find);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post('/signup',
    body('email').isEmail().withMessage("invalid email"),
    body('password').isLength({ min: 5 }).withMessage("password to short"),
    async (req, res) => {
        const { username, password, email } = req.body;
        const validator = validationResult(req);

        if(!validator.isEmpty()) {
            const error = validator.array().map(error => {
                return {
                    msg: error.msg,
                    param: error.param
                }
            });
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
            const user = new User({ username, password: hashPassword, email });
            await user.save();

            //JWT
            const token = await JWT.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: 360000 });

            return res.status(200).json({
                error: [],
                data: {
                token,
                    user: {
                       id: user._id,
                       email: user.email 
                    }
                }

            });   
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: 'something is going wrong' });
    }
    
});

router.post('/login', (req, res) => {
    res.json({ start: "start" })
})


module.exports = router;