const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/Product");

// CREATE ORDER - Logged-in user
const createOrder = async (req, res) => {
    try {
        const { customer, items } = req.body;

        if (!customer || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Customer details and cart items are required."
            });
        }

        const requiredFields = [
            "name", "phone", "email", "address", "city"
        ];

        for (const field of requiredFields) {
            if (!customer[field] || !String(customer[field]).trim()) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required.`
                });
            }
        }

        for (const item of items) {
            if (
                !mongoose.Types.ObjectId.isValid(item.productId) ||
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) < 1
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID or quantity."
                });
            }
        }

        const quantities = new Map();

        for (const item of items) {
            const id = String(item.productId);

            quantities.set(
                id,
                (quantities.get(id) || 0) + Number(item.quantity)
            );
        }

        const productIds = [...quantities.keys()];

        const products = await Product.find({
            _id: { $in: productIds },
            status: "approved"
        });

        if (products.length !== productIds.length) {
            return res.status(404).json({
                success: false,
                message: "One or more products are unavailable."
            });
        }

        let subtotal = 0;
        const orderItems = [];

        for (const product of products) {
            const quantity = quantities.get(product._id.toString());

            if (quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}.`
                });
            }

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity
            });

            subtotal += product.price * quantity;
        }

        const newOrder = await Order.create({
            user: req.user.id,

            customer: {
                name: String(customer.name).trim(),
                phone: String(customer.phone).trim(),
                email: String(customer.email).trim(),
                address: String(customer.address).trim(),
                city: String(customer.city).trim(),
                notes: customer.notes
                    ? String(customer.notes).trim()
                    : ""
            },

            items: orderItems,
            subtotal,
            total: subtotal,
            paymentMethod: "COD",
            paymentStatus: "Pending",
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: newOrder
        });

    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while creating order."
        });
    }
};

// USER: Own orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch your orders."
        });
    }
};

// ADMIN: All orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch orders."
        });
    }
};

// ADMIN: Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const allowedStatuses = [
            "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status."
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated.",
            order
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// USER: Single own order; ADMIN: Any order
const getOrderById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID."
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        const isOwner =
            order.user && order.user.toString() === req.user.id;

        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You cannot view this order."
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch order."
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    getOrderById
};