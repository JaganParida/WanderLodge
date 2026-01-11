const User = require("../models/user.js");

// signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// signup route
module.exports.signup = async (req, res, next) => {
  // 'next' must be here
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // stop execution and send error to middleware
      }
      req.flash("success", "Welcome to Wanderlust!");
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup"); // stop execution after redirect
  }
};

// login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// login route
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  return res.redirect(redirectUrl);
};

// logout route
module.exports.logout = (req, res, next) => {
  // 'next' must be here
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have successfully logged out");
    return res.redirect("/");
  });
};
