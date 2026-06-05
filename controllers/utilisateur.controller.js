const Utilisateur = require("../models/utilisateur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function inscrire(req, res) {
  const { nom, email, motDePasse } = req.body;

  if (!nom || !email || !motDePasse) {
    return res
      .status(400)
      .json({ message: "Tous les champs sont obligatoires" });
  }

  try {
    const utilisateurExistant = await Utilisateur.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: "Cet email est deja utilise" });
    }

    const motDePasseChiffre = await bcrypt.hash(motDePasse, 10);

    const nouvelUtilisateur = new Utilisateur({
      nom,
      email,
      motDePasse: motDePasseChiffre,
    });
    await nouvelUtilisateur.save();

    return res.status(201).json({ message: "Utilisateur cree avec succes" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function connecter(req, res) {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse,
    );
    if (!motDePasseValide) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { inscrire, connecter };
