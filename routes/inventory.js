var shopifyAPI = require('shopify-node-api');

var express = require('express');
var router = express.Router();






router.get("/", (req, res) => {
	
	console.log('testt');
	Shopify.get('/admin/products.json', query_data, function(err, data, headers){
     console.log(data); // Data contains product json information 
     console.log(headers); // Headers returned from request 
});


	res.send("products route test!");
} );


module.exports = router;