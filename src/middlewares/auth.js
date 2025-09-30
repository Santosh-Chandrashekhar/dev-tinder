const User = require("../models/user");
var jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedToken = jwt.verify(token, "santosh123454");
    const { id } = decodedToken;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
};

module.exports = { userAuth };
