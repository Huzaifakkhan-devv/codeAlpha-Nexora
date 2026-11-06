const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    getOrderById
} = require("../controllers/orderController");

router.post("/", protect, createOrder);

router.get("/mine", protect, getMyOrders);

router.get("/", protect, adminOnly, getOrders);

router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

router.get("/:id", protect, getOrderById);

module.exports = router;