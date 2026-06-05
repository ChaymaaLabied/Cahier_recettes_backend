const jwt = require("jsonwebtoken");

function verifierToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const donnees = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = donnees;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

module.exports = verifierToken;
