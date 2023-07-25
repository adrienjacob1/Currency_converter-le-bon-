const mongoose = require("mongoose");


const currencySchema = mongoose.Schema({
    code: { type: String, required: true },
    country: { type: String, required: true }
})


module.exports = mongoose.model("Currency", currencySchema);