const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
    getProducts,
    getProductById,
    createProduct,
    getMyProducts,
    getAllAdminProducts,
    reviewProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// Public routes
router.get("/", getProducts);


// Logged-in user routes
router.get("/mine", protect, getMyProducts);
router.get("/:id", getProductById);
// Admin routes
router.get("/admin/all", protect, adminOnly, getAllAdminProducts);
router.patch("/:id/review", protect, adminOnly, reviewProduct);

// Protected product management
router.post("/", protect, upload.single("image"), createProduct);
router.put("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;