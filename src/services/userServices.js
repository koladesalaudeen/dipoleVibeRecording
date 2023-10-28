const mongoose = require("mongoose");
const User = require("../models/user");

const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.remove();
};

module.exports = {
  deleteUser,
};
