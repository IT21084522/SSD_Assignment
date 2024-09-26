const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET_KEY_ACCESS_TOKEN = process.env.JWT_SECRET_KEY_ACCESS_TOKEN; 
const JWT_SECRET_KEY_REFRESH_TOKEN = process.env.JWT_SECRET_KEY_REFRESH_TOKEN;

exports.generateAccessAndRefreshToken = (payload, res) => {
    let token = jwt.sign(payload, JWT_SECRET_KEY_ACCESS_TOKEN, { expiresIn: '3m' });
    let refreshToken = jwt.sign(payload, JWT_SECRET_KEY_REFRESH_TOKEN, { expiresIn: '3m' });

    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 3 * 60 * 1000
    });
    
    res.cookie('jwt_refresh_token', refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'Strict',
        maxAge: 3 * 60 * 1000
    });
    
    return {token, refreshToken};
};

exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_KEY_ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

exports.refreshToken = (refreshToken, res) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, JWT_SECRET_KEY_REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                const { userId, isAdmin } = decoded;
                const newTokens = this.generateAccessAndRefreshToken({ userId, isAdmin }, res);
                resolve(newTokens);
            }
        });
    });
};
