const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Validator } = require("node-input-validator");

const passwordSchema = require("../security/password");
const User = require("../models/user");



// Inscription
exports.createUser = (req, res) => {
    // verifier le format de l'email et le password dans le body de la requete
    const validInput = new Validator(req.body, {
        username: "required|string|length:50",
        email: "required|email|length:50",
        password: "required|string|length:16" //redondance avec les regles du password déja à 16 max mais on l'a mis qd meme.
    });

    validInput.check()
    .then((matched) => {
        //si body pas ok
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            // si le corps de la requete est conforme -> vérifier règles du password
            if (passwordSchema.validate(req.body.password)) {
                // si le password correspond aux regles -> crypter le password avec bcypt
                bcrypt.hash(req.body.password, 10)
                .then(() => {

                // générer un nouvel id avec mongoose
                const newId = new mongoose.Types.ObjectId();

                // new User avec les valeurs du body
                const user = new User( {
                    userId: newId,
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    isAdmin: false
                });
                
                // étape finale : user.save( { user } ) // sauvegardé dasn la db
                user.save()
                .then(() => req.status(201).json({ message: "User account created"}))
                .catch(() => res.status(500).json({ error: "Internal servor error with database" }));


                })
                .catch(() => res.status(500).json({ error: "Internal servor error with bcrypt" }));
             
            } else {
                throw "Invalid password";
            }


        }

      
    })
    .catch(() => res.status(500).send(valInput.errors));
   
};