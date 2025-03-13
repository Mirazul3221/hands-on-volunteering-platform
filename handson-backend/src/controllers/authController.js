const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const stream = require('stream');

// Cloudinary configuration (replace with your Cloudinary credentials)
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(201).json({ message: "User registered successfully" ,token});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.user = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token
    const user = await User.findById(userId)
      .populate({
        path: "volunteerHistory.eventId",
        select: "title description location type urgency category createdBy",
        populate: {
          path: "createdBy", // Populate the user who created the event
          select: "name email profilePicture", // Select fields you need from the user
        },
      })
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
};



  exports.updateProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming JWT middleware adds user info to req.user
      const { name, bio, skills, causes } = req.body;
  
      let profilePictureUrl = null;
      
      // console.log(name, bio, skills, causes)
      // console.log(req.file)
      // If there's a file (image), upload to Cloudinary

      if (req.file) {
        console.log(req.file);
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer); // Create a readable stream from the file buffer
      
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "profiles" }, // Optional: organize uploads by folder
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            bufferStream.pipe(stream);
          });
      
          profilePictureUrl = uploadResult.secure_url; // Get the uploaded image URL
          console.log("Uploaded Image URL:", profilePictureUrl);
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
          return res.status(500).json({ message: "Error uploading image", error });
        }
      }
  
      // Update user profile with the new data (including the profile picture URL)
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, bio, skills, causes, profilePicture: profilePictureUrl },
        { new: true }
      );
  
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error });
    }
  };//

