if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user.js");

// API Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const wishlistRouter = require("./routes/wishlist.js");
const bookingRouter = require("./routes/booking.js");
const dashboardRouter = require("./routes/dashboard.js");
const hostRouter = require("./routes/host.js");
const chatbotRouter = require("./routes/chatbot.js");

// Database connection
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/Vistiqo";

main()
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Database!");
  })
  .catch((err) => {
    console.log("\n❌ ================= MONGODB ERROR ================= ❌");
    console.log("Failed to connect to the database!");
    if (err.message.includes("bad auth") || err.message.includes("authentication failed")) {
      console.log("REASON: Invalid Username or Password in your ATLASDB_URL.");
      console.log("ACTION REQUIRED: Please open backend/.env and fix your ATLASDB_URL password.");
    } else {
      console.log(err.message);
    }
    console.log("❌ ================================================= ❌\n");
  });

async function main() {
  await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 5000 });
}

// Middleware setup
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Passport middleware for Authentication (LocalStrategy for login)
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // If not, see if email exists
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        // Link google account
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      const newUser = new User({
        username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 10000),
        email: profile.emails[0].value,
        googleId: profile.id,
        role: "user"
      });
      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err, null);
    }
  }
));

// Note: JWT Strategy is handled in middleware.js directly for token verification

// API Routes Mounting
app.use("/api/listings", listingRouter);
app.use("/api/listings/:id/reviews", reviewRouter);
app.use("/api/listings/:id", bookingRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/wishlists", wishlistRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth", userRouter);
app.use("/api/host", hostRouter);
app.use("/api/chatbot", chatbotRouter);

// Base Route
app.get("/api", (req, res) => {
    res.json({ message: "Welcome to Vistiqo API" });
});

// 404 Error Handler
app.use((req, res, next) => {
  next(new ExpressError(404, "API Endpoint Not Found!"));
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).json({ error: message });
});

// Server Listening
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
