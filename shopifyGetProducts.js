const shopifyAPI = require('shopify-node-api');
const Shopify = require("./Shopify")
const allShopifyProducts = require("./shopifyProducts")



function shopifyGetProducts(callback) {


 callback = callback || function () {}



return new Promise(function (resolve, reject) {

		Shopify.get('https://wiredin-solutions.myshopify.com/admin/products.json', function(err, data, headers){
		 



		  			if (err) {
					            var reason = new Error('shopify is not happy, no data for you!');
					            reject(reason); // reject
					            return callback(err)
					} 

					else {

					            // allShopifyProducts.push2array(data)
								console.log("data is about to resolve !!!  ")
								resolve(data); // fulfilled
								return callback(null, data)
					        }




					});// closing shopify get req


		})// closing new promise

};//closing shopifyproducts function


module.exports = shopifyGetProducts





module.exports.getProducts = function () {
			    shopifyGetProducts()
			        .then(function (fulfilled) {
			            // yay, we got products
			            console.log("getProducts FULFILLED!!!!!   ");
			            
			         // 
			        })
			        .catch(function (error) {
			            // oops, shopify is angered
			            console.log(error.message);
			         // output: 'shopify is not happy...'
			        });
			};
/////////////////////////////////////////////////////////////////////






