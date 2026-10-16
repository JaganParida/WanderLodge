const app = require("../backend/app.js");

module.exports = (req, res) => {
  return app(req, res);
};
