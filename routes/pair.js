const express = require("express");
const pairCtrl = require("../controllers/pair");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, pairCtrl.getAllPairs); // http://localhost:8081/pair/
router.get("/:id", auth, pairCtrl.getOnePair);// http://localhost:8081/pair/id
router.post("/", auth, pairCtrl.createPair);
router.put("/increment", pairCtrl.incrementPair); // On place la route d'incrémentation avant celle avec le param
router.put("/:id", auth, pairCtrl.updatePair);
router.delete("/:id", auth, pairCtrl.deletePair);



module.exports = router;