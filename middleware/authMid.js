const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    let token = req.header('authorization');

    if(!token) res.status(401).json({ msg: 'authorization error' });

    token = token?.split(' ')[1];

    try {
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode.email;
        next();
    } catch (error) {
        return res.status(404).json({ error });
    }
}