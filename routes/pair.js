const express = require("express");
const pairCtrl = require("../controllers/pair");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, pairCtrl.getAllPairs); // http://localhost:8081/pair/
router.get("/:id", auth, pairCtrl.getOnePair);// http://localhost:8081/pair/id
router.post("", userCtrl.createPair);// http://localhost:8081/pair/signup
router.put("/increment", auth, pairCtrl.incrementPair); // http://localhost:8081/login
router.delete("/:id", auth, pairCtrl.deletePair);



module.exports = router;