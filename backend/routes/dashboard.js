const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const dashboardController = require("../controllers/dashboards.js");

// Dashboard Route
router.get("/", isLoggedIn, wrapAsync(dashboardController.renderProfile));

module.exports = router;
