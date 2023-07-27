const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');

const passwordSchema = require('../security/password');
const User = require('../models/user');


// Inscription
exports.createUser = (req, res) => {

    // vérifier le format de l'email et le password dans le body de la requête
    const validInput = new Validator(req.body, {
        username: 'required|string|length:50',
        email: 'required|email|length:50',
        password: 'required|string|length:16'
    });

    validInput.check()
    .then( (matched) => {
        // si body pas ok
        if (!matched) {
            res.status(400).send(validInput.errors);
            
        } else {

            // si le corps de la requête ok -> vérifier les règles du password
            if (passwordSchema.validate(req.body.password)) {

                // si password ok -> crypter le password avec bcrypt
                bcrypt.hash(req.body.password, 10)
                .then((hash) => {

                    // générer un nouvel id avec mongoose ( étape optionnelle car mongoDB génère aussi un id mais c'est utile de savoir le faire )
                    const newId = new mongoose.Types.ObjectId();

                    // new User avec les valeurs du body
                    const user = new User( {
                        userId: newId,
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                        isAdmin: false
                    } );

                    // Étape finale : user.save( { user } )
                    user.save()
                    .then(() => res.status(201).json({ message: 'User account created' }))
                    .catch(() => res.status(500).json({ error: 'Internal servor error with database' }));
                
                })
                .catch(() => res.status(500).json({ error: 'Internal servor error with bcrypt' }));
            
            } else {
                res.status(400).json({ error : "Password doesn't meet the rules"});
            }
        }
    } )
    .catch(() => res.status(400).send(validInput.errors));
};

exports.logUser = (req, res) => {

    // récupérer pw et l'email envoyés par le front
    const validInput = new Validator(req.body, {
        email: 'required|email|length:50',
        password: 'required|string|length:16'
    });

    // les valider ou pas
    validInput.check()
    .then( (matched) => {

        // si body pas ok
        if (!matched) {
            res.status(400).send(validInput.errors);
            
        } else {
            // vérifier si un compte correspondant ou pas
            User.findOne({ email: req.body.email })
            .then( user => {
                if (!user) {

                    // Tempo pour limiter les attaques de force brute
                    // const tempo = resolve => setTimeout(resolve, 5000);
                    // Promise.all(tempo);

                    return res.status(401).json({ error : "Username or password is invalid!" }); // message anti-pirate
                }

                // utiliser bcrypt pour comparer le pw reçu avec le pw hashé dans la db
                bcrypt.compare( req.body.password, user.password)
                .then( valid => {
                    if (!valid) {

                        // Tempo pour limiter les attaques de force brute
                        // const tempo = resolve => setTimeout(resolve, 5000);
                        // Promise.all(tempo);
    
                        return res.status(401).json({ error : "Username or password is invalid!" }); // message anti-pirate
                    }

                    // Etape finale : connexion à la db + générer un token avec jwt les infos user utiles
                    res.status(200).json( {
                        userId: user.userId,
                        isAdmin: user.isAdmin,
                        token: jwt.sign( 
                            {
                                userId: user.userId,
                                isAdmin: user.isAdmin
                            },
                            'SECRET_TOKEN_STRING',
                            { 
                                expiresIn: '3h' 
                            } 
                        )
                    } );
                })
                .catch(() => res.status(500).json({ message: "Internal servor error with bcrypt"}));
            } )
            .catch(() => res.status(500).json({ message: "Internal servor error with db"}));
        }
    } )
    .catch(() => res.status(500).send(validInput.errors));
};

exports.getAllUsers = (req, res) => {

    User.findOne({ userId: res.locals.userId })
    .then( user => {
        if (user.isAdmin) {
            User.find()
            .then( users => {

                // Masquage des données personnelles
                users.forEach(user => {
                    user.email = "emailmasque@service.com";
                    user.password = "motdepassemasque";
                });

                res.status(200).json(users);
            })
            .catch(() => res.status(500).json({ message: "Internal servor error with db"}));
        } else {
            res.status(401).json({ error : "Access denied!"});
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error with db"}));
} 

exports.getOneUser = (req, res) => {

    User.findOne({ userId: res.locals.userId })
    .then( user => {

        if (user.isAdmin) {

            User.findOne({ userId: req.params.id })
            .then( user => {

                // Masquage des données personnelles
                user.email = "emailmasque@service.com";
                user.password = "motdepassemasque";

                res.status(200).json(user);
            })
            .catch(() => res.status(500).json({ message: "Internal servor error with db"}));

        } else if ( res.locals.userId === req.params.id ) {

            User.findOne({ userId: req.params.id })
            .then(user => res.status(200).json(user)) // retourner l'objet user sans le pw crypté
            .catch(() => res.status(500).json({ message: "Internal servor error with db"}));
        } else {
            res.status(401).json({ error : "Access denied!"});
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error with db"})); 
}

exports.updateUser = (req, res) => {

    User.findOne({ userId: req.params.id })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: "Didn't find user!"});
        }
        
        if ( user.userId == res.locals.userId ) {

            const validInput = new Validator(req.body, {
                username: 'required|string|length:50',
                email: 'required|email|length:50',
                password: 'required|string|length:16'
            });
    
            validInput.check()
            .then(matched => {
                if(!matched) {
                    res.status(400).send(validInput.errors);
                }
    
                if (passwordSchema.validate(req.body.password)) {

                    bcrypt.hash(req.body.password, 10)
                    .then(hash => {

                        const updateUser = {
                            ...user._doc,
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                        };
    
                        User.updateOne({ userId: req.params.id }, {
                            ...updateUser
                        })
                        .then(() => res.status(200).json({ message: "User account updated!" }))
                        .catch(() => res.status(500).json({ message: "Internal servor error with db"}));
                            
                    })
                    .catch(() => res.status(500).json({ error: 'Internal servor error with bcrypt' }))
                
                } else {
                    res.status(400).json({ error : "Password doesn't meet the rules"});
                }
            })
            .catch(() => res.status(500).send(validInput.errors));
            
        } else {
            res.status(401).json({ error : "Access denied!"});
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error with db"}));

        


    // User.findOne({ userId: req.params.id })
    // .then((user) => {
    //     if (!user) {
    //       return res.status(404).json({ error: "Didn't find user!" });
    //     }

    //     if (user.userId == res.locals.userId) {
    //         const validInput = new Validator(req.body, {
    //             username: "required|string|length:50",
    //             email: "required|email|length:50",
    //             password: "required|string|length:16",
    //         });

    //         validInput.check()
    //         .then((matched) => {
    //             if (!matched) {
    //                 res.status(400).send(validInput.errors);
    //             }

    //             if (passwordSchema.validate(req.body.password)) {

    //                 bcrypt.hash(req.body.password, 10)
    //                 .then((hash) => {

    //                     const updateUser = {
    //                         ...user._doc,
    //                         username: req.body.username,
    //                         email: req.body.email,
    //                         password: hash,
    //                     };

    //                     console.log(updateUser);

    //                     User.updateOne({ userId: req.params.id }, { ...updateUser } )
    //                     .then(() => res.status(200).json({ message: "User account updated!" }))
    //                     .catch(() => res.status(500).json({ message: "Internal servor error with db" }));
    //                 })
    //                 .catch(() => res.status(500).json({ error: "Internal servor error with bcrypt" }));
    //             } else {
    //                 res.status(400).json({ error: "Password doesn't meet the rules" });
    //             }
    //         })
    //         .catch(() => res.status(500).send(validInput.errors));
    //     } else {
    //         res.status(401).json({ error: "Access denied!" });
    //     }
    // })
    // .catch(() => res.status(500).json({ message: "Internal servor error with db" }) );
}

exports.deleteUser = (req, res) => {

    User.findOne({ userId: req.params.id })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error :"Didn't find user!"});
        }

        if ( user.userId == res.locals.userId ) {

            User.deleteOne({ userId: req.params.id })
            .then(() => res.status(200).json({ message: "User account deleted!" }))
            .catch(() => res.status(500).json({ message: "Internal servor error with db"}));
        } else {
            res.status(401).json({ error : "Access denied!"});
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error with db"}));
}