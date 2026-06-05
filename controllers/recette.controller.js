const Recette = require("../models/Recette");

async function obtenirToutesLesRecettes(req, res) {
  try {
    const { ingredient, auteur, tri } = req.query;
    const filtre = {};

    if (ingredient) {
      filtre.ingredients = ingredient;
    }

    if (auteur) {
      filtre.auteur = auteur;
    }

    let recettes = await Recette.find(filtre).populate("auteur", "nom email");

    if (tri === "date") {
      recettes.sort((a, b) => b.date - a.date);
    } else if (tri === "popularite") {
      // popularite = nombre de commentaires
      recettes.sort((a, b) => b.commentaires.length - a.commentaires.length);
    }

    return res.status(200).json(recettes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function obtenirRecetteParId(req, res) {
  try {
    const recette = await Recette.findById(req.params.id).populate(
      "auteur",
      "nom email",
    );
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvee" });
    }
    return res.status(200).json(recette);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function creerRecette(req, res) {
  const { titre, ingredients, etapes } = req.body;

  if (!titre || !ingredients || !etapes) {
    return res
      .status(400)
      .json({ message: "Titre, ingredients et etapes sont obligatoires" });
  }

  try {
    const nouvelleRecette = new Recette({
      titre,
      ingredients,
      etapes,
      auteur: req.utilisateur.id,
    });

    await nouvelleRecette.save();
    return res.status(201).json(nouvelleRecette);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function modifierRecette(req, res) {
  try {
    const recette = await Recette.findById(req.params.id);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvee" });
    }

    if (recette.auteur.toString() !== req.utilisateur.id) {
      return res.status(403).json({ message: "Action non autorisee" });
    }

    const recetteMiseAJour = await Recette.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    return res.status(200).json(recetteMiseAJour);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function supprimerRecette(req, res) {
  try {
    const recette = await Recette.findById(req.params.id);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvee" });
    }

    if (recette.auteur.toString() !== req.utilisateur.id) {
      return res.status(403).json({ message: "Action non autorisee" });
    }

    await Recette.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Recette supprimee" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function ajouterCommentaire(req, res) {
  const { contenu } = req.body;

  if (!contenu) {
    return res
      .status(400)
      .json({ message: "Le contenu du commentaire est obligatoire" });
  }

  try {
    const recette = await Recette.findById(req.params.id);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvee" });
    }

    recette.commentaires.push({ auteur: req.utilisateur.id, contenu });
    await recette.save();

    return res.status(201).json(recette);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  obtenirToutesLesRecettes,
  obtenirRecetteParId,
  creerRecette,
  modifierRecette,
  supprimerRecette,
  ajouterCommentaire,
};
