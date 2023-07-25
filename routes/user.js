const express = require("express");
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("", auth, userCtrl.getAllUsers); // http://localhost:8081/users/
router.get("/:id", auth, userCtrl.getOneUser);// http://localhost:8081/users/id:
router.post("/signup", userCtrl.createUser );// http://localhost:8081/users/signup
router.post("/:login", userCtrl.logUser);// http://localhost:8081/users/login
router.put("/:id", auth, userCtrl.updateUser);
router.delete("/:id", auth, userCtrl.deleteUser);



module.exports = router;