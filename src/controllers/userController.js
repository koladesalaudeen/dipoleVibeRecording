const User = require("../models/user");
const userService = require("../services/userServices");

const userController = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return;
    }

    const newUser = new User({ email });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Bad Request" });
    }

    await userService.deleteUser(userId);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  userController,
  deleteUser,
};
