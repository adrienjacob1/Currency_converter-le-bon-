//Libs
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Routers
const pairRouter = require("./routes/pair");
const userRouter = require("./routes/user");
const currencyRouter = require("./routes/currency");

//MongoDBcredentials
const credentials = { user: process.env.USER, pw: process.env.PW, db: process.env.DB};
const origin = `mongodb+srv://${credentials.user}:${credentials.pw}@${credentials.db}.jjteo0l.mongodb.net/?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());  //Analyse le JSON et m'y donne accès ne JS

mongoose.connect(origin, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connecté à MongoDB"))
.catch(() => console.log("Connexion à MongoDB échouée"));

//Configurer les en-têtes acceptées
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization ");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

// Utiliser les routers

module.exports = app;