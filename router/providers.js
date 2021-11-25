const express = require('express');
const router = express.Router();
const url = require('url');
const Provider = require('../models/Providers');
const { body, validationResult } = require('express-validator');

router.post('/provider',
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
        const provider = new Provider({ username, password, email })
        await provider.save();
        return res.json(provider);   
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ message: 'something is going wrong' });
    }
    
})

module.exports = router;