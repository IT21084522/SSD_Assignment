const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};

// Route to get all products (accessible to all authenticated users)
router.get("/", authenticateJWT, productController.getAllProducts);

// Route to get product details by ID (accessible to all authenticated users)
router.get("/:id", authenticateJWT, productController.getProductDetailsById);

// Route to get all orders by product ID (accessible to all authenticated users)
router.get("/allOrderByProductId/:id", authenticateJWT, productController.allOrderByProductId);

// Route to create a new product (accessible to admin users only)
router.post("/create", authenticateJWT, authorizeAdmin, productController.createProduct);

// Route to update an existing product (accessible to admin users only)
router.post("/update", authenticateJWT, authorizeAdmin, productController.updateProduct);

// Route to delete a product by ID (accessible to admin users only)
router.delete("/delete/:id", authenticateJWT, authorizeAdmin, productController.deleteProduct);

module.exports = router;
