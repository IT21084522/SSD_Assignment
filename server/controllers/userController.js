const userModel = require("../models/userModel");
const { generateAccessAndRefreshToken } = require('../utils/token');

exports.register = (req, res) => {
    const { email, password, isAdmin, fname, lname } = req.body;
    userModel.register(email, password, isAdmin, fname, lname)
        .then(result => {
            console.log("Successful Register");
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error registering user.");
        });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    userModel.login(email, password)
        .then(userData => {
            // Generate tokens and set cookies
            const { token, refreshToken } = generateAccessAndRefreshToken(userData, res);

            // Send a response with user data and tokens
            res.status(200).json({
                message: "Login successful",
                token: token,
                refreshToken: refreshToken,
                user: {
                    userId: userData.userId,
                    isAdmin: userData.isAdmin
                }
            });
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error logging in.");
        });
};
