var express = require('express');
var router = express.Router();







router.get("/", (req, res) => {
	// first thing they see
	console.log('homepage route testt');
	


	res.render("homepage");
} );


module.exports = router;