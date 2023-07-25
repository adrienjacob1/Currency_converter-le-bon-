const jwt = require("jsonwebtoken");

const auth = (req, rs, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodeToken = jwt.verify(token, "SECRET_TOKEN_STRING");
        res.locals.userId = userId;
        next();

    } catch (error) {
        res.status(401).json({ error: error | "Authentification failed!"})
    }
};

module.exports = auth;