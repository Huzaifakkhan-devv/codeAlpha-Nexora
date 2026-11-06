const User = require("../models/user");

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch users."
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin accounts cannot be deleted here."
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted."
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getUsers, deleteUser };