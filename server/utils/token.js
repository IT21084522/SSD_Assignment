const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret keys from environment variables
const JWT_SECRET_KEY_ACCESS_TOKEN = process.env.JWT_SECRET_KEY_ACCESS_TOKEN; 
const JWT_SECRET_KEY_REFRESH_TOKEN = process.env.JWT_SECRET_KEY_REFRESH_TOKEN;

// Function to generate tokens and set them as cookies in the response
exports.generateAccessAndRefreshToken = (payload, res) => {
    let token = jwt.sign(payload, JWT_SECRET_KEY_ACCESS_TOKEN, { expiresIn: '3m' });
    let refreshToken = jwt.sign(payload, JWT_SECRET_KEY_REFRESH_TOKEN, { expiresIn: '3m' });

    // Set cookies in the response
    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 3 * 60 * 1000  // 3 minutes
    });

    res.cookie('jwt_refresh_token', refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'Strict',
        maxAge: 3 * 60 * 1000  // 3 minutes
    });
    
    // Return tokens if needed
    return { token, refreshToken };
};

// Function to verify the token
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

// Function to refresh the access token
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
