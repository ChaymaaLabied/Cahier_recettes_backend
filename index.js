require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/database");

connectDB();

app.set("port", process.env.PORT || 5000);

const server = http.createServer(app);
server.listen(process.env.PORT || 5000, () => {
  console.log("Serveur demarre sur le port " + (process.env.PORT || 5000));
});
