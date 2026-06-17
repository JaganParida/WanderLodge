const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/users.js");
const { isLoggedIn } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Signup API
router.post("/signup", wrapAsync(userController.signup));

// Login API
router.post(
  "/login",
  passport.authenticate("local", {
    session: false,
    failWithError: true
  }),
  (err, req, res, next) => {
    return res.status(401).json({ error: "Invalid username or password" });
  },
  userController.login
);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login?error=true" }),
  userController.googleCallback
);

// Get current user from httpOnly cookie (no localStorage needed)
router.get("/me", isLoggedIn, userController.getCurrentUser);

// Update user preferences
router.put("/preferences", isLoggedIn, userController.updatePreferences);

// Logout API — clears the httpOnly cookie
router.get("/logout", userController.logout);

// Profile update with avatar upload
router.put("/profile", isLoggedIn, upload.single("avatar"), wrapAsync(userController.updateProfile));

// Forgot Password
router.post("/forgot-password", wrapAsync(userController.forgotPassword));

// Reset Password
router.post("/reset-password/:token", wrapAsync(userController.resetPassword));

module.exports = router;
