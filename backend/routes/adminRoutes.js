const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
    getUsers,
    deleteUser
} = require("../controllers/adminController");

router.use(protect, adminOnly);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

module.exports = router;