const express = require('express');
const router = express.Router();
const url = require('url');
const Provider = require('../models/Providers');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

router.get('/all', async (req, res) => {
    try {
        const providers = await Provider.find();
        return res.json(providers)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
});

router.post('/create',
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
        const hashPassword = bcrypt.hashSync(password, 6);
        const provider = new Provider({ username, password: hashPassword, email })
        await provider.save();
        return res.json(provider);   
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ message: 'something is going wrong' });
    }
    
});

router.put('/update',
    body('email').isEmail().withMessage("invalid email"),
    body('password').isLength({ min: 5 }).withMessage("password to short"),
    async (req, res) => {
        const find = url.parse(req.url, true).query;
        const { username } = req.body;
        const { password } = req.body;
        const { email } = req.body;
        try {
            const updateProvider = await Provider.findOneAndUpdate(find.username, 
                { $set: { username, password, email } }, { new: true });
            return res.json(updateProvider);
        } catch (error) {
            res.status(400).json({ error })
    }
})

module.exports = router;