const express = require("express");
const userCtrl = require("../coontrollers/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/users", auth, userCtrl.getAllUsers);
router.get("/users/:id", auth, userCtrl.getOneUser);
router.post("/users/signup", userCtrl.createUser );
router.post("/users/:login", userCtrl.logUser);
router.put("/users/:id", auth, userCtrl.updateUser);
router.delete("/users/:id", auth, userCtrl.deleteUser);



module.exports = router;