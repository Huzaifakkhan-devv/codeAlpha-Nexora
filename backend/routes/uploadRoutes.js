const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Image is required"
        });
    }

    res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        image: `/uploads/${req.file.filename}`
    });
});

module.exports = router;