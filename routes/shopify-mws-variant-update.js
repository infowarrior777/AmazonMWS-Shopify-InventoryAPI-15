const shopifyAPI = require('shopify-node-api');
const express = require('express');
const router = express.Router();
const Shopify = require("../Shopify")
const shopifyGetProducts = require("../shopifyGetProducts")
const shopifyUpdateProducts = require("../shopifyUpdateProducts")
const shopifyProducts = require("../shopifyProducts")
const amazonPrevOrderList = require("../amazonPrevOrderList")
const amazonGetOrders = require("../amazonGetOrders")
const tools = require("../tools")
const db = require("../db")
const knex = require("knex")




router.get("/", (req, res) => {


// ////////////////////////////////////////////////////
shopifyGetProducts()

.then((result) => {
  sendtowait(result);
console.log("done sending to sendtowait")
})


function sendtowait(shopifyproducts){
// console.log('waiting 3 seconds to start amazonGetOrders')
// setTimeout(waitToGetAmazon, 3000);
waitToGetAmazon(shopifyproducts);
}

//////////////////////////////////////////////////////////
function waitToGetAmazon(shopifyproducts) {
	amazonGetOrders()
	.then((result) => {
		console.log('sending to tools.checkifNEXTTOKEN')
		tools.checkifNEXTTOKEN(shopifyproducts, result);
	})
}
//////////////////////////////////////////////////////////





	res.send("products route test!");
});


module.exports = router;