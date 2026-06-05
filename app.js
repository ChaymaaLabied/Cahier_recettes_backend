const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

const recetteRoutes = require("./routes/recette.routes");
const utilisateurRoutes = require("./routes/utilisateur.routes");

const app = express();

app.use(express.json());

app.use("/recettes", recetteRoutes);
app.use("/utilisateurs", utilisateurRoutes);

const swaggerDocument = yaml.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
