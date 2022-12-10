const JWT = require("jsonwebtoken");
const AUTH_CONFIG = require("../config/auth.config");

module.exports = (req, res, next) => {
    const auth_header = req.get("Authorization");

    if (!auth_header) {
        res.status(401).send({
            message: "Unauthorized",
        });
    }

    const token = auth_header.split(" ")[1];
    let decoded_token;

    try {
        decoded_token = JWT.verify(token, AUTH_CONFIG.jwt_key);
    } catch (err) {
        res.status(401).send({
            message: "Unauthorized",
        });
    }

    if (!decoded_token) {
        res.status(401).send({
            message: "Unauthorized",
        });
    }
    req.token_user = decoded_token;
    next();
};




// const jwt = require('jsonwebtoken');
// const auth = require('../config/auth.config');

// const verifyToken = (req, res, next) => {
//     let token = req.headers['x-access-token'];

//     if (!token) {
//         return res.status(403).send({ message: 'No token provided!' });
//     }

//     jwt.verify(token, auth.secret, (err, decoded) => {
//         if (err) {
//             return res.status(401).send({ message: 'Unauthorized!' });
//         }
//         req.userId = decoded.id;
//         next();
//     });
// };

// const authJwt = {
//     verifyToken: verifyToken
// };
// module.exports = authJwt;
