const express = require("express");
const currencyCtrl = require("../controllers/pair");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, currencyCtrl.getAllCurrencies); // http://localhost:8081/currencies/
router.get("/:id", auth, currencyCtrl.getOneCurrency);// http://localhost:8081/curencies/id
router.post("/", currencyCtrl.createCurrency);// http://localhost:8081/pair/signup
router.delete("/:id", auth, currencyCtrl.updateCurrency);
router.delete("/:id", auth, currencyCtrl.deleteCurrency);



module.exports = router;