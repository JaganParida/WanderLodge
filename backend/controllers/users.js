const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateToken = (user) => {
    return jwt.sign({ _id: user._id, username: user.username, email: user.email, role: user.role }, process.env.SECRET, {
        expiresIn: "7d",
    });
};

// Cookie options for httpOnly secure cookie
const cookieOptions = {
    httpOnly: true,       // JavaScript CANNOT access this cookie
    secure: true, // HTTPS only (Vercel is HTTPS)
    sameSite: "none",   // Allows cross-site cookie sending for Vercel edge/api
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

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    let transporter;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      // Fallback for development if no credentials are provided
      console.log("No EMAIL_USER or EMAIL_PASS provided in .env. Falling back to Ethereal Email (test account).");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: `"WanderLodge Support" <${process.env.EMAIL_USER || 'no-reply@wanderlodge.com'}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #ff385c; text-align: center;">WanderLodge Password Reset</h2>
          <p>Hi ${user.username},</p>
          <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the following link, or paste this into your browser to complete the process:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #ff385c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #555;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      `,
    };

    // Send email asynchronously (fire and forget) to make the API respond instantly
    transporter.sendMail(mailOptions).then(info => {
      if (!process.env.EMAIL_USER) {
         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    }).catch(err => {
      console.error("Async email sending failed:", err);
    });

    res.json({ message: "An email has been sent to " + email + " with further instructions." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to send password reset email. Please try again." });
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
