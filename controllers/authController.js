require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming you have a User model for MongoDB

// Handle user registration
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    // Return the token along with userId and email
    res.status(201).json({
      token,
      userId: newUser._id,  // Include userId in the response
      email: newUser.email,  // Optionally return email or other user data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Handle user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    // Return the token along with userId and email
    res.status(200).json({ token, userId: user._id, email: user.email });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { registerUser, loginUser };
