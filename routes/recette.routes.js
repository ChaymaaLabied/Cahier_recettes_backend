const express = require("express");
const router = express.Router();
const verifierToken = require("../middleware/authentification");
const {
  obtenirToutesLesRecettes,
  obtenirRecetteParId,
  creerRecette,
  modifierRecette,
  supprimerRecette,
  ajouterCommentaire,
} = require("../controllers/recette.controller");

router.get("/", obtenirToutesLesRecettes);
router.get("/:id", obtenirRecetteParId);
router.post("/", verifierToken, creerRecette);
router.put("/:id", verifierToken, modifierRecette);
router.delete("/:id", verifierToken, supprimerRecette);
router.post("/:id/commentaires", verifierToken, ajouterCommentaire);

module.exports = router;
