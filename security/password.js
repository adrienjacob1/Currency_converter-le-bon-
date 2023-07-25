const passwordValidator = require("password-validator")
const passwordSchema = new passwordValidator();

passwordSchema
is().min(10)
is().max(16)
.has().uppeercase()
.has().lowerecase()
.has().letters()
.has().digits()
.has().not().symbols()
.is().not().oneOf(["Passw0rddddd"]);

module.exports = passwordShema;
