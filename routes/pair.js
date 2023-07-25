const express = require("express");
const pairCtrl = require("../coontrollers/pair");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/pairs", auth, userCtrl.getAllPairs);
router.get("/pairs/:id", auth, userCtrl.getOnePair);
router.post("/pairs", userCtrl.createPair);
router.put("/pairs/increment", auth, userCtrl.incrementPair); // ONplace la route d'incrementation avant celle avec le paramertre id pour que le router ne prenne pas increment en id.
router.post("/pairs/:id", userCtrl.updatePair);
router.delete("/pairs/:id", auth, userCtrl.deletePair);



module.exports = router;