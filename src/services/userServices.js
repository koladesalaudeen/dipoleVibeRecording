const mongoose = require("mongoose");
const User = require("../models/user");

const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.remove();
};

async function findUsersByEmail(recipientsMail) {
  try {
    const users = await User.find({ email: { $in: recipientsMail } });
    return users;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  deleteUser,
  findUsersByEmail
};
