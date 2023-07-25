const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true }, // id supplementaire et optionnel pour voir comment le générer via l'ORM de
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);