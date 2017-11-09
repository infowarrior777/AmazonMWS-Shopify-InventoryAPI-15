const express = require("express");
const router = express.Router();

router.get("/:id", (req, res) => {
	console.log(req.params);
	res.send("users route test!");
} );


module.exports = router;