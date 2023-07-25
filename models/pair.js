const mongoose = require("mongoose");


const pairSchema = mongoose.Schema({
    firstCurrency: { type: String, required: true },
    secondCurrency: { type: String, required: true },
    rate: { type: Number, required: true },
    numberOfUses: { type: Number, required: true },
})


module.exports = mongoose.model("Pair", pairSchema); 