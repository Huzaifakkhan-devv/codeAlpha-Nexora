const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    image: {
        type: String,
        required: [true, "Product image is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    stock: {
        type: Number,
        default: 10,
        min: [0, "Stock cannot be negative"]
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);