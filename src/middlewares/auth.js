const isAdmin = (req, res, next) => {
  console.log("is user checked?");
  const token = "hsdljcbowurqndddocdlj";
  const isAuthorisedAdmin = token === "hsdljcbowurqndddocdlj";
  if (isAuthorisedAdmin) {
    next();
  } else {
    res.status(401).send("User is not authorised");
  }
};

module.exports = { isAdmin };
