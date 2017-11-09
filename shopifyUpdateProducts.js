const shopifyAPI = require('shopify-node-api');
const Shopify = require("./Shopify")
const shopifyProducts = require("./shopifyProducts")



function shopifyUpdateProducts(amazonItemReady2dec, callback) {


 callback = callback || function () {}





return new Promise(function (resolve, reject) {

		var variantid = amazonItemReady2dec.variantId;
		var updateVariant = {};
		updateVariant = {"variant":{"inventory_quantity": amazonItemReady2dec.variantUPDatedQuantity}}

	
		Shopify.put('https://wiredin-solutions.myshopify.com/admin/variants/'+ variantid +'.json', updateVariant, function(err, data, headers){
		  // console.log(JSON.stringify(data)); // Data contains product json information 
		  // console.log(JSON.stringify(headers)); // Headers returned from request 
		



		  			if (err) {
					            var reason = new Error('shopify is not happy, no Update for you!');
					            reject(reason); // rejected
					            return callback(err)
					} 

					else {

					            
								console.log('Update Shopify Variant Success!!!!!!!!!!!!!!!!');
								resolve(data); // fulfilled
								return callback(null, data)
					        }




					});// closing shopify put req


		})// closing new promise

};//closing shopify update products function


module.exports = shopifyUpdateProducts

