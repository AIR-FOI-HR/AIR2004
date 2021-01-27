const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    let user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;
    req.token = token;

    next();
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
