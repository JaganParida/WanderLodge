const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, ".env") });
}

const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const nodemailer = require("nodemailer");

const connectDB = require("./db.js");
const ExpressError = require("./utils/ExpressError.js");
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

// 1. Trust Reverse Proxy (Essential for Vercel, Render & HTTPS cookie forwarding)
app.set("trust proxy", 1);

// 2. HTTP Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // SPA frontend handles its own CSP; avoids blocking Leaflet / Unsplash / Cloudinary
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 3. NoSQL Injection Sanitization (Recursively strips dangerous $ and . operators)
function sanitizeMongo(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeMongo);
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      continue; // Drop dangerous operator key
    }
    sanitized[key] = sanitizeMongo(obj[key]);
  }
  return sanitized;
}

app.use((req, res, next) => {
  if (req.body) req.body = sanitizeMongo(req.body);
  if (req.query) req.query = sanitizeMongo(req.query);
  if (req.params) req.params = sanitizeMongo(req.params);
  next();
});

// 4. Rate Limiting (Serverless & Free-Quota Protection against brute-force & API abuse)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP. Please try again after 15 minutes." },
});
app.use("/api", apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please try again after 15 minutes." },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

// 5. CORS Configuration (Allows localhost, production domains, and *.vercel.app preview branches)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(",").forEach((url) => {
    const trimmed = url.trim().replace(/\/$/, "");
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      // Dynamically allow any Vercel deployment preview origin
      if (/^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-server-api-key"],
  })
);

// 6. Request Body & Cookie Parsers (Vercel free tier limit is 4.5MB)
app.use(cookieParser());
app.use(express.json({ limit: "4.5mb" }));
app.use(express.urlencoded({ extended: true, limit: "4.5mb" }));
app.use(methodOverride("_method"));

// 7. Passport Setup for Authentication
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = new User({
          username:
            profile.displayName.replace(/\s+/g, "").toLowerCase() +
            Math.floor(Math.random() * 10000),
          email: profile.emails[0].value,
          googleId: profile.id,
          role: "user",
        });
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// 8. Serverless Cached Database Connection Middleware
app.use(async (req, res, next) => {
  // Fast health check bypasses DB check if requested
  if (req.path === "/api/health" || req.path === "/health") {
    return res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed for request:", err.message);
    res.status(503).json({
      error:
        "Database Unavailable: Could not connect to MongoDB Atlas cluster. Please verify IP whitelist (0.0.0.0/0) in MongoDB Atlas Network Access.",
    });
  }
});

// 9. Built-in Serverless Email Handler (/api/send-email)
const handleSendEmail = async (req, res) => {
  const apiKey = req.headers["x-server-api-key"];
  if (process.env.SERVER_API_KEY && apiKey !== process.env.SERVER_API_KEY) {
    return res.status(401).json({ error: "Unauthorized. Invalid API Key." });
  }

  const { to, subject, html } = req.body;
  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields: to, subject, html" });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ error: "EMAIL_USER and EMAIL_PASS are not configured." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WanderLodge Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Email sending error:", err);
    return res.status(500).json({ error: "Failed to send email.", details: err.message });
  }
};

// 10. Route Mounting (Supports both /api/* and root rewrites)
const apiRouter = express.Router();

apiRouter.post("/send-email", handleSendEmail);
apiRouter.use("/listings", listingRouter);
apiRouter.use("/listings/:id/reviews", reviewRouter);
apiRouter.use("/listings/:id", bookingRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/wishlists", wishlistRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/auth", userRouter);
apiRouter.use("/host", hostRouter);
apiRouter.use("/chatbot", chatbotRouter);

apiRouter.get("/", (req, res) => {
  res.json({
    message: "Welcome to WanderLodge API",
    status: "healthy",
    version: "1.0.0",
  });
});

// Mount router under both /api and root to guarantee zero 404s with any Vercel rewrite pattern
app.use("/api", apiRouter);
app.use(apiRouter);

// 11. 404 Handler for Unrecognized Endpoints
app.use((req, res, next) => {
  next(new ExpressError(404, `API Endpoint Not Found: ${req.method} ${req.originalUrl}`));
});

// 12. Global Production-Hardened Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID format for resource: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate entry detected.";
  }

  if (statusCode >= 500) {
    console.error(`[Server Error ${statusCode}] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({ error: message });
});

// 13. Server Listening (Local development standalone execution)
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

// Export for Vercel Serverless Function Handler
module.exports = app;
