const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {

    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({message: 'authorization error'});
        }
        const decode = JWT.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(403).json({ error });
    }
};