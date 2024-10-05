const pool = require("../database/connection");
const bcrypt = require('bcryptjs');

exports.register = (email, password, isAdmin, fname, lname) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        reject(new Error("User already exists"));
                    } else {
                        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
                            if (hashErr) {
                                reject(hashErr);
                            } else {
                                pool.query(
                                    "INSERT INTO users (email, password, isAdmin, fname, lname) VALUES (?,?,?,?,?);",
                                    [email, hashedPassword, isAdmin, fname, lname],
                                    (insertErr, result) => {
                                        if (insertErr) {
                                            reject(insertErr);
                                        } else {
                                            resolve(result);
                                        }
                                    }
                                );
                            }
                        });
                    }
                }
            }
        );
    });
};


exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT userId, password, isAdmin FROM users WHERE email = ?;",
            [email],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length === 0) {
                        reject(new Error("Invalid email or password"));
                    } else {
                        const storedHashedPassword = result[0].password;
                        bcrypt.compare(password, storedHashedPassword, (compareErr, isMatch) => {
                            if (compareErr) {
                                reject(compareErr);
                            } else if (!isMatch) {
                                reject(new Error("Invalid email or password"));
                            } else {
                                // Return user data without token handling
                                let userData = {
                                    userId: result[0].userId,
                                    isAdmin: result[0].isAdmin
                                };
                                resolve(userData);
                            }
                        });
                    }
                }
            }
        );
    });
};
