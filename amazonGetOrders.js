const mws = require('./config/mws')
const amazonPrevOrderList = require("./amazonPrevOrderList")



function amazonGetOrders(callback) {


 callback = callback || function () {}



return new Promise(function (resolve, reject) {


              /////////
              //Start getting amazon orders 
              var date = new Date();
              // nowmin = date.toISOString(date.setDate(date.getMinutes() - 15));
              date.setDate(date.getDate() - 1);  
                 

              // Using mws-simple - creating Amazon Recent Order object with path and query
              let listOrders = {
                path: '/Orders/2013-09-01',
                query: {
                      Action: 'ListOrders',
                      CreatedAfter: date.toISOString(),
                      // CreatedBefore: nowmin,
                      'MarketplaceId.Id.1': 'ATVPDKIKX0DER',
                       Version: '2013-09-01'
                 
                }
              }

    mws.request(listOrders, function(err, result) {


            if (err) {
                      var reason = new Error('Amazon is not happy, no data for you!');
                      reject(reason); // reject
                      return callback(err)
          } 

          else {


                var orders = JSON.stringify(result);
                var orders0 = JSON.parse(orders);
                var amazonORDERSlist = orders0;
                // amazonPrevOrderList.push2array(amazonORDERSlist);

                console.log("AmazonOrders are about to resolve !!!  ")
                resolve(result); // fulfilled
                return callback(null, result) //also providing a callback just in case we need one later or whatev
                  }




          });// closing shopify get req


    })// closing new promise

};//closing shopifyproducts function


module.exports = amazonGetOrders















// function checkifNEXTTOKEN(){
// if (amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken) {
//   var nexTToken = amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken
//   console.log('NEXTTOKEN Exists, Sending 2 nextToken function ' + nexTToken)
//           nextToken(nexTToken, amazonORDERSlist)
//       }//closing if theres a next token in the amazonORDERSlist array statement
      
//         else{

//           console.log('No nextToken, Sending Straight 2 checkOrderIdduplicate' + JSON.stringify(amazonORDERSlist))
//           // console.log('amazonORDERSlist' + amazonORDERSlist)
//           // console.log(JSON.stringify(amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken));
//           checkOrderIdDuplicate(amazonORDERSlist);
//         }//closing else theres still an amazonORDERSlist array

// }



















// /////////
// //Start getting amazon orders 
// var date = new Date();
// // nowmin = date.toISOString(date.setDate(date.getMinutes() - 15));
// date.setDate(date.getDate() - 1);  
   

// // Using mws-simple - creating Amazon Recent Order object with path and query
// let listOrders = {
//   path: '/Orders/2013-09-01',
//   query: {
//         Action: 'ListOrders',
//         CreatedAfter: date.toISOString(),
//         // CreatedBefore: nowmin,
//         'MarketplaceId.Id.1': 'ATVPDKIKX0DER',
//          Version: '2013-09-01'
   
//   }
// }
// // var amazonOrderList;

// //////// MAKING FIRST AMAZON API CALL LIST ORDERS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// // making MWS listOrders request to the listOrders/Orders/2013-09-01 api endpoint 
// //////// REMEMBER to add param in xmlparser in MWS line 99: { explicitArray : false, ignoreAttrs : true, mergeAttrs: true },
// mws.request(listOrders, function(e, result) {
//      // console.log(JSON.stringify(result));
//        var orders = JSON.stringify(result);
//        var orders0 = JSON.parse(orders);

//        var amazonORDERSlist = orders0;
//        // amazonPrevOrderList.push2array(amazonORDERSlist);
// console.log('AmazonOrderList frm mws req ')

// console.log('SUCCESS getting listOrders NOW sending to check if theres a nextToken')

// // orderListLoop(amazonORDERSlist);




// if (amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken) {
//   var nexTToken = amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken
//   console.log('NEXTTOKEN Exists, Sending 2 nextToken function ' + nexTToken)
//           nextToken(nexTToken, amazonORDERSlist)
//       }//closing if theres a next token in the amazonORDERSlist array statement
      
//         else{

//           console.log('No nextToken, Sending Straight 2 checkOrderIdduplicate' + JSON.stringify(amazonORDERSlist))
//           // console.log('amazonORDERSlist' + amazonORDERSlist)
//           // console.log(JSON.stringify(amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken));
//           checkOrderIdDuplicate(amazonORDERSlist);
//         }//closing else theres still an amazonORDERSlist array


// }); // closing mws request
// ////////////////////////////////////