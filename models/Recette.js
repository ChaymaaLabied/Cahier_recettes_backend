const mongoose = require("mongoose");

const schemaCommentaire = new mongoose.Schema({
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: true,
  },
  contenu: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const schemaRecette = new mongoose.Schema({
  titre: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  etapes: [{ type: String, required: true }],
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: true,
  },
  date: { type: Date, default: Date.now },
  commentaires: [schemaCommentaire],
});

module.exports = mongoose.model("Recette", schemaRecette);
