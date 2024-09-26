// cartController.js

const cartModel = require("../models/cartModel");
const { verifyToken } = require('../utils/token'); 

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: Missing or invalid token');
    }

    const tokenValue = token.split(' ')[1];
    verifyToken(tokenValue)
        .then(decoded => {
            req.user = decoded; 
            next();
        })
        .catch(err => {
            console.error('Token verification failed:', err);
            return res.status(401).send('Unauthorized: Invalid token');
        });
};

exports.getShoppingCart = [authenticateUser, (req, res) => {
    const userIdFromToken = req.user.userId; // Extract userId from token
    const userId = req.params.userId;

    // Ensure the user is only accessing their own cart
    if (userIdFromToken !== parseInt(userId)) {
        return res.status(403).send("Forbidden: Cannot access other users' carts");
    }

    cartModel.getShoppingCart(userId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error fetching shopping cart.");
        });
}];

exports.addToCart = [authenticateUser, (req, res) => {
    const { customerId, productId, quantity, isPresent } = req.body;
    const userIdFromToken = req.user.userId; // Extract userId from token

    if (userIdFromToken !== parseInt(customerId)) {
        return res.status(403).send("Forbidden: Cannot modify other users' carts");
    }

    cartModel.addToCart(customerId, productId, quantity, isPresent)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error adding product to cart.");
        });
}];

exports.removeFromCart = [authenticateUser, (req, res) => {
    const productId = req.params.productId;
    const userIdFromToken = req.user.userId; // Extract userId from token
    const userId = req.params.userId;

    // Ensure the user is only removing items from their own cart
    if (userIdFromToken !== parseInt(userId)) {
        return res.status(403).send("Forbidden: Cannot remove products from other users' carts");
    }

    cartModel.removeFromCart(productId, userId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error removing product from cart.");
        });
}];

exports.buy = [authenticateUser, (req, res) => {
    const userIdFromToken = req.user.userId; // Extract userId from token
    const customerId = req.params.id;

    // Ensure the user is only purchasing from their own cart
    if (userIdFromToken !== parseInt(customerId)) {
        return res.status(403).send("Forbidden: Cannot purchase products from other users' carts");
    }

    const address = req.body.address;

    cartModel.buy(customerId, address)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error purchasing products.");
        });
}];
