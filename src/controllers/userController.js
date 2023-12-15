const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/user");
const userService = require("../services/userServices");

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY,   
  api_secret:process.env.CLOUDINARY_API_SECRET, 
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images",
    allowed_formats: ["mp4", "avi", "mkv", "jpeg", "mov"],
  },
});

async function uploadProfileImage(base64String) {
  try {
    const base64extract = base64String?.split(';base64,').pop();

    if(!base64extract) return;
    const { secure_url } = await cloudinary.uploader.upload(
      'data:image/jpeg;base64,'+base64extract,
      {
        resource_type: "image",
      }
    );

    return secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
  }
}

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

const updateUser = async (req, res) => {
  const { firstName, lastName, email, newEmail, profileImage } = req.body;

  try {
    const existingUserOldEmail = await User.findOne({ email });

    let existingUserNewEmail;

    if (newEmail) {
      existingUserNewEmail = await User.findOne({ email: newEmail });
    }

    if (existingUserOldEmail || existingUserNewEmail) {
      const existingUser = existingUserOldEmail || existingUserNewEmail;

      existingUser.firstName = firstName;
      existingUser.lastName = lastName;

      if (profileImage) {
        const profileImageUrl = await uploadProfileImage(profileImage);
        existingUser.profileImageUrl = profileImageUrl;
      }

      if (newEmail && email !== newEmail) {
        existingUser.email = newEmail;
      }

      await existingUser.save();

      res.status(200).json({
        message: "User information updated successfully",
        user: existingUser,
      });
    } else {
      
      const newUser = new User({
        firstName,
        lastName,
        email: newEmail || email, 
      });

     
      if (profileImage) {
        newUser.profileImageUrl = await uploadProfileImage(profileImage);
      }

      await newUser.save();

      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    }
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserInfo = async(req, res) => {
  const { email } = req.query;

  try{
    const existingUser = await User.findOne( {email} );
    if( existingUser ){
      res.status(200).json( existingUser );
    }else{
      res.status(404).json({message: "User not found" })
    }
  }
  catch(error){
    console.log(error);
    res.status(404).json({ message: "User not found"});
  }
}

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
  updateUser,
  getUserInfo
};
