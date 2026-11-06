const Product = require("../models/Product");
const mongoose = require("mongoose");

// PUBLIC: Approved products only
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            status: "approved"
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// PUBLIC: Single approved product
const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            });
        }

        const product = await Product.findOne({
            _id: req.params.id,
            status: "approved"
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// USER / ADMIN: Create product
const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;

        if (
            !name?.trim() ||
            price === undefined ||
            price === "" ||
            !description?.trim() ||
            !category?.trim() ||
            !req.file
        ) {
            return res.status(400).json({
                success: false,
                message: "All product fields and image are required."
            });
        }

        const isAdmin = req.user.role === "admin";

        const product = await Product.create({
            name: name.trim(),
            price: Number(price),
            description: description.trim(),
            category: category.trim(),
            stock: Number(stock),
            image: `/uploads/${req.file.filename}`,
            seller: req.user.id,
            status: isAdmin ? "approved" : "pending"
        });

        res.status(201).json({
            success: true,
            message: isAdmin
                ? "Product published successfully."
                : "Product submitted. Waiting for admin approval.",
            product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// SELLER: Own products
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({
            seller: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ADMIN: All products, including pending and rejected
const getAllAdminProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ADMIN: Approve or reject
const reviewProduct = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be approved or rejected."
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            message: `Product ${status}.`,
            product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// SELLER / ADMIN: Update product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        const isOwner =
            product.seller &&
            product.seller.toString() === req.user.id;

        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You cannot edit this product."
            });
        }

        const allowedFields = [
            "name", "price", "description", "category", "stock"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        if (req.file) {
            product.image = `/uploads/${req.file.filename}`;
        }

        // Seller's edited product needs approval again
        if (!isAdmin) {
            product.status = "pending";
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: isAdmin
                ? "Product updated."
                : "Product updated and submitted for approval.",
            product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// SELLER / ADMIN: Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        const isOwner =
            product.seller &&
            product.seller.toString() === req.user.id;

        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete this product."
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully."
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    getMyProducts,
    getAllAdminProducts,
    reviewProduct,
    updateProduct,
    deleteProduct
};