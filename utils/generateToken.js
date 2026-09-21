const jwt = require("jsonwebtoken");

const generateToken = (email, id) => {
  const token = jwt.sign({ email, id }, process.env.SECRET_KEY, {
    expiresIn: "90d",
  });

  return token;
};

module.exports = generateToken;
