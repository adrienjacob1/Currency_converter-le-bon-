const {Validator} = require("node-input-validator");
const User = require("../models/user");
const Pair = require("../models/pair");


exports.createPair = (req, res) => {
    User.findOne({ userId: res.locals.userId })
    .then(user => {
        if (user.userId == res.locals.userId) {

            const validInput = new Validator(req.body, {
                firstCurrency: 'required|string|length:50',
                secondCurrency: 'required|string|length:50',
                rate: 'required|numeric|min:0|max:100'
            });
        
            validInput.check()
            .then( (matched) => {
                if (!matched) {
                    res.status(400).send(validInput.errors);
                    
                } else { 

                    const pair = new Pair({
                        firstCurrency: req.body.firstCurrency,
                        secondCurrency: req.body.secondCurrency,
                        rate: req.body.rate,
                        numberOfUses: 0
                    })

                    pair.save()
                    .then(() => res.status(200).json({ message: "Pair created!"}))
                    .catch(() => res.status(500).json({ message: "Internal servor error on save pair"}));
                }
            })
            .catch(() => res.status(500).send(validInput.errors));
        } else {
            res.status(401).json({ message : "Access denied!"});
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error on find user"}));
}


exports.updatePair =(req, res) => {
    User.findOne({ userId: res.locals.userId })
    .then(user => {
        if (user.userId == res.locals.userId) {

            const validInput = new Validator(req.body, {
                firstCurrency: 'required|string|length:50',
                secondCurrency: 'required|string|length:50',
                rate: 'required|numeric|min:0|max:100'
            });

            validInput.check()
            .then( (matched) => {
                if (!matched) {
                    res.status(400).send(validInput.errors);
                    
                } else { 

                    Pair.findOne({ _id: req.params.id })
                    .then(() => {
                        Pair.updateOne({ _id: req.params.id }, {
                            firstCurrency: req.body.firstCurrency,
                            secondCurrency: req.body.secondCurrency,
                            rate: req.body.rate,
                        
                        })

                        .then(() => res.status(200).json({ message: "Pair updated!"}))
                        .catch(() => res.status(500).json({ message: "Internal servor error"}));
                    })
                    .catch(() => res.status(404).json({ message: "Didn't find pair"}));
                }
            }) 
        } else {
            res.status(401).json({ message : "Access denied!"});
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error"}));
}




exports.incrementPair = (req, res) => {
   
            Pair.findOneAndUpdate({ firstCurrency: req.body.firstCurrency, secondCurrency: req.body.secondCurrency }, { $inc: { numberOfUses: 1 } }, { new: true })
            .then((pair) => res.status(200).json(pair))
            .catch(() => res.status(404).json({ message: "Didn't find pair" }))

}


exports.getAllPairs = (req, res) => {
    User.findOne({ userId: res.locals.userId })
    .then(user => {
        if (user.userId == res.locals.userId) {

            Pair.find()
            .then((pairs) => res.status(200).json(pairs))
            .catch(() => res.status(404).json({ message: "Didn't find pairs" }))

        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error" }))
}

exports.getOnePair = (req, res) => {
    User.findOne({ userId: res.locals.userId })
    .then(user => {
        if (user.userId == res.locals.userId) {

            Pair.findOne({ _id: req.params.id })
            .then((pair) => res.status(200).json(pair))
            .catch(() => res.status(404).json({ message: "Didn't find pair" }))

        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error" }))
}

exports.deletePair = (req, res) => {
    User.findOne({ userId: res.locals.userId })
    .then(user => {
        if (user.userId == res.locals.userId) {

            Pair.findOne({ _id: req.params.id })
            .then(() => {
                Pair.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: "Pair deleted" }))
                .catch(() => res.status(500).json({ message: "Internal servor error" }));
                
            })
            .catch(() => res.status(404).json({ message: "Didn't find pair" }))

           
        }
    })
    .catch(() => res.status(500).json({ message: "Internal servor error" }))
}