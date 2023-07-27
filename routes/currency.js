const express = require("express");
const currencyCtrl = require("../controllers/currency");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", currencyCtrl.getAllCurrencies); // http://localhost:8081/currencies/
router.get("/:id", currencyCtrl.getOneCurrency);// http://localhost:8081/curencies/id
router.post("/", auth, currencyCtrl.createCurrency);// http://localhost:8081/pair/signup
router.put("/:id", auth, currencyCtrl.updateCurrency);
router.delete("/:id", auth, currencyCtrl.deleteCurrency);



module.exports = router;