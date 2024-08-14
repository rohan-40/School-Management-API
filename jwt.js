const jwt = require("jsonwebtoken");

const jwtMiddleWare =  (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(404).json({ message: "Token not Found" });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decorded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decorded;
    next();
  } 
  catch (err) {
    console.log(err);
    res.status(501).json({ message: "Invalid Token" });
  }
};

const generateToken = (userData) =>{
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn: 100000})
}

module.exports = {jwtMiddleWare,generateToken};