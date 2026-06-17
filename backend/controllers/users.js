const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (user) => {
    return jwt.sign({ _id: user._id, username: user.username, email: user.email, role: user.role }, process.env.SECRET, {
        expiresIn: "7d",
    });
};

// Cookie options for httpOnly secure cookie
const cookieOptions = {
    httpOnly: true,       // JavaScript CANNOT access this cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",   // Blocks CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/",
};

// Signup API
module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;
    if (!role || !["user", "host", "admin"].includes(role)) {
       role = "user";
    }
    const newUser = new User({ username, email, role });
    const registeredUser = await User.register(newUser, password);

    const token = generateToken(registeredUser);

    // Set token in httpOnly cookie — NOT in response body
    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({ 
        message: "Welcome to WanderLodge!", 
        user: { _id: registeredUser._id, username, email, role: registeredUser.role }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login API
module.exports.login = async (req, res) => {
  try {
    const token = generateToken(req.user);

    // Set token in httpOnly cookie — NOT in response body
    res.cookie("jwt", token, cookieOptions);

    res.json({ 
        message: "Welcome back to WanderLodge!", 
        user: { _id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
};

// Google Callback
module.exports.googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res.cookie("jwt", token, cookieOptions);
    res.redirect("http://localhost:5173/");
  } catch (error) {
    res.redirect("http://localhost:5173/login?error=true");
  }
};

// Get current authenticated user (from cookie)
module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ 
      user: { 
        _id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        language: user.language,
        currency: user.currency,
        avatar: user.avatar
      } 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};

// Update user preferences
module.exports.updatePreferences = async (req, res) => {
  try {
    const { language, currency } = req.body;
    const user = await User.findById(req.user._id);
    if (language) user.language = language;
    if (currency) user.currency = currency;
    await user.save();
    
    res.json({ message: "Preferences updated successfully", language: user.language, currency: user.currency });
  } catch (error) {
    res.status(500).json({ error: "Failed to update preferences" });
  }
};

// Logout API — clears the httpOnly cookie
module.exports.logout = (req, res, next) => {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "strict", path: "/" });
    res.json({ message: "You have successfully logged out" });
};

// Profile update with avatar upload
module.exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user._id);
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (req.file) {
      user.avatar = req.file.path;
    }
    
    await user.save();
    
    res.json({ 
      message: "Profile updated successfully", 
      user: { _id: user._id, username: user.username, email: user.email, role: user.role, language: user.language, currency: user.currency, avatar: user.avatar } 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Forgot Password
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account with that email address exists." });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Since there's no SMTP setup, we simulate email sending by logging it.
    console.log(`\n======================================================`);
    console.log(`[SIMULATED EMAIL] Forgot Password Request for ${email}`);
    console.log(`Password Reset Link: http://localhost:5173/reset-password/${token}`);
    console.log(`======================================================\n`);

    res.json({ message: "An email has been sent to " + email + " with further instructions." });
  } catch (error) {
    res.status(500).json({ error: "Failed to process request" });
  }
};

// Reset Password
module.exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ error: "Password reset token is invalid or has expired." });
    }

    await user.setPassword(password); // passport-local-mongoose method
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Success! Your password has been changed." });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password" });
  }
};
