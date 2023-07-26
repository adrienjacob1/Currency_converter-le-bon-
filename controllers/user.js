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

exports.logUser = (req, res) => {
    // récupérer pw et l'email envoyés par le front
    const validInput = new Validator(req.body, {
        username: "required|string|length:50",
        email: "required|email|length:50",
        password: "required|string|length:16"  });
    
    // Les valider ou pas
        validInput.check()
        .then((matched) => {
            //si body pas ok
            if (!matched) {
                res.status(400).send(validInput.errors);
            } else {
                 // vérifier si un compte correspondant ou pas
                 User.findOne({ email: req.bodyemail })  // Voir doc open office. User.findOne() est une méthode do Mongoose (notre outil pour communiquer avec la base de donnée)
                 .then( user => {
                    if (!user) {

                        // Temppo pour limiter les attaques de force brute
                        const tempo = resolve => setTimeout(resolve, 5000);
                        Promise.all(tempo);
                        return res.status(401).json({ error: "Username or password is invalid!" })

                    }
                    // Utilser bcrypt pour comparer le pw hashé dans la db
                    bcrypt.compare( req.body.password, user.password )
                    .then(valid => {

                        if (!valid) {

                            // Temppo pour limiter les attaques de force brute
                            const tempo = resolve => setTimeout(resolve, 5000);
                            Promise.all(tempo);
                            return res.status(401).json({ error: "Username or password is invalid!" }) // message anti-pirate (on ne précise pas si c'est le password ou le mail pour ne pas orienter le pirate)
    
                        }

                        // Etape finale : connexion a la db + générer un token avec les infos user utiles
                        res.status(200).json({
                            userId: user.userId,
                            isAdmin: user.isAdmin,
                            token: jwt.sign( 
                                {
                                    userId: user.userId,
                                    isAdmin: user.isAdmin  // on encode le booleen isAdmin 
                                },
                                "SECRET_TOKEN_STRING",
                                { 
                                    expiresIn: "1h" 
                                }
                                )
                            })

                    })
                    .catch(() =>  res.status(500).json({ message: "Internal servor error with bcrypt"}));
                    
                 } )
                 .catch(() => res.status(500).json({ message: "Internal servor error with db" }))
                
    
            }
    
          
        })
        .catch(() => res.status(500).send(valInput.errors));
       
    };   
   

exports.getAllUsers = (req, res) => {

    User.findOne({ userId: res.locals.userId })
    .then( user => {
        if (user.isAdmin) {
            User.find()
            .then( users => {

                // Masquage des données personnelles
                users.forEach(user => {
                    user.email = "emailmasque@service.com"; // dans la réalité probablement des points par exemple pour masquer.
                    user.password = "motdepassemasque";
                });
                res.status(200).json(users);
            } )
            .catch(() => res.status(500).json({ message: "Internal servor error with db" }));
        } else {
            res.status(401).json({ error : "Access denied!" })
        }
    } )
    .catch(() => res.status(500).json({ message: "Internal servor error with db" }));

}

exports.getOneUser = (req, res) => {

    User.findOne({ userId: res.locals.userId })
    .then( user => {

        if (user.isAdmin) {

            User.findOne({ userId: req.params.id })  //  On passe en argument de  User.findOne un objet
            .then( user => {

                // Masquage des données personnelles
                user.email = "emailmasque@service.com"; // dans la réalité probablement des points par exemple pour masquer.
                user.password = "motdepassemasque";
                
                res.status(200).json(user);
            } )
            .catch(() => res.status(500).json({ message: "Internal servor error with db" }));
        } else if (res.locals.userId === req.params.id) {
            User.findOne({ userId: reqParams.id })
            .then(user => res.status(200).json(user))
            .catch(() => res.status(500).json({ message: "Internal servor error with db" }))
        } else {
            res.status(401).json({ error : "Access denied!" })
        }
    } )
    .catch(() => res.status(500).json({ message: "Internal servor error with db" }));
}


exports.updateUser = (req, res) => {

    const validInput = new Validator(req.body, {
        username: "required|string|length:50",
        email: "required|email|length:50",
        password: "required|string|length:16" //redondance avec les regles du password déja à 16 max mais on l'a mis qd meme.
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        }

        if (passwordSchema.validate(req.body.password)) {
            bcrypt.hash(req.body.password, 10)
            .then(hash =>{
                
                User.findOne({ userId: req.param.id })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({ error: "Didn't find user!" })
                    }
        
                    if ( user.userId === req.locals.userId ) {
        
                        User.updateOne({ userId: reqParams.id }, {
                            email: req.body.email,
                            username: req.boddy.username,
                            password: hash
                        })
                        .then(user => res.status(200).json({message: "User account updated!"}))
                        .catch(() => res.status(500).json({ message: "Internal servor error with db" }))
                    }
                    else {
                        res.status(401).json({ error : "Access denied!" })
                    }
                })
            })
            .catch(() => res.status(500).json({ error: "Internal servor error with bcrypt" }))
        } else {
            throw "Invalid password";
        } 
})

.catch(() => res.status(500).send( validInput.errors ));
}


exports.deleteUser = (req, res) => {
    User.findOne({ userId: req.param.id })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: "Didn't find user!" });
        }

        if ( user.userId === req.locals.userId ) {

            User.deleteOne({ userId: reqParams.id })
                .then(() => res.status(200).json({message: "User account updated!"}))
                .catch(() => res.status(500).json({ message: "Internal servor error with db" }));
            } else {
                res.status(401).json({ error : "Access denied!" });
            }
            
        })
        .catch(() => res.status(500).json({ error: "Internal servor error with db" }))
}