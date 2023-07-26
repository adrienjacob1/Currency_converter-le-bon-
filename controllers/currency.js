const { Validator } = require('node-input-validator');
const User = require('../models/user');
const Currency = require('../models/currency');

exports.createCurrency = (req, res) => {

    User.findOne({ userId: res.locals.userId })
    .then(user => {
        if (user.isAdmin) {

            const validInput = new Validator(req.body, {
                code: 'required|string|length:50',
                country: 'required|string|length:50',
            });
        
            validInput.check()
            .then( (matched) => {
                if (!matched) {
                    res.status(400).send(validInput.errors);
                    
                } else { 

                    const currency = new Currency({
                        code: req.body.code,
                        country: req.body.country
                    })

                    currency.save()
                    .then(() => res.status(200).json({ message: "Currency created!"}))
                    .catch(() => res.status(500).json({ message: "Internal servor error"}));
                }
            })
            .catch(() => res.status(500).send(validInput.errors));
        } else {
            res.status(401).json({ message : "Access denied!"});
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error"}));

}

exports.updateCurrency = (req, res) => {

    User.findOne({ userId: res.locals.userId })
    .then(user => {
        if (user.isAdmin) {

            const validInput = new Validator(req.body, {
                code: 'required|string|length:50',
                country: 'required|string|length:50',
            });
        
            validInput.check()
            .then( (matched) => {
                if (!matched) {
                    res.status(400).send(validInput.errors);
                    
                } else { 

                    Currency.findOne({ _id: req.params.id })
                    .then(() => {
                        Currency.updateOne({ _id: req.params.id }, {
                            code: req.body.code,
                            country: req.body.country
                        })
                        .then(() => res.status(200).json({ message: "Currency updated!"}))
                        .catch(() => res.status(500).json({ message: "Internal servor error"}));
                    })
                    .catch(() => res.status(404).json({ message: "Didn't find currency"}));
                }
            }) 
        } else {
            res.status(401).json({ message : "Access denied!"});
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error"}));

}

exports.deleteCurrency = (req, res) => {
    User.findOne({ userId: res.locals.userId })
    .then(user => {
        if (user.isAdmin) {
            Currency.findOne({ _id: req.params.id })
            .then(() => {

                Currency.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: "Currency deleted!"}))
                .catch(() => res.status(500).json({ message: "Internal servor error"}));
            })
            .catch(() => res.status(404).json({ message: "Didn't find currency"}));
        } else {
            res.status(401).json({ message : "Access denied!"});
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error"}));
}

exports.getAllCurrencies = (req, res) => {
    Currency.find()
    .then((currencies) => res.status(200).json(currencies))
    .catch(() => res.status(404).json({ message: "Didn't find currencies"}));
}

exports.getOneCurrency = (req, res) => {
    Currency.findOne({ _id: req.params.id })
    .then((currency) => res.status(200).json(currency))
    .catch(() => res.status(404).json({ message: "Didn't find currency"}));
}