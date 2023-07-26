const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, 'SECRET_TOKEN_STRING');
        const userId = decodeToken.userId;
        res.locals.userId = userId;
        next();
        
    } catch (error) {
        res.status(401).json({ error: error | 'Authentication failed!' });
    }
};

module.exports = auth;