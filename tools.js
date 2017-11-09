const mws = require('./config/mws')
const amazonPrevOrderList = require("./amazonPrevOrderList")
const amazonDuplicateOrders = require("./amazonDuplicateOrders")
const amazonOrderItemsSave = require("./amazonOrderItemsSave")
const shopifyUpdateProducts = require("./shopifyUpdateProducts")
// const allShopifyProducts = require("./shopifyProducts")
const db = require("./db")
const knex = require("knex")
  

 

var allShopifyProducts;
       function checkifNEXTTOKEN(allShopifyProducts1, amazonORDERSlist){
          allShopifyProducts = allShopifyProducts1;

          console.log("allShopifyProducts frm checkifNEXTTOKKEN" + allShopifyProducts)

      if (amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken) {
        var nexTToken = amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken
        console.log('NEXTTOKEN Exists, Sending 2 nextToken function ' + nexTToken)
                nextToken(nexTToken, amazonORDERSlist)
            }//closing if theres a next token in the amazonORDERSlist array statement
            
              else{

                console.log('No nextToken, Sending Straight 2 checkOrderIdduplicate' + JSON.stringify(amazonORDERSlist))
                // console.log('amazonORDERSlist' + amazonORDERSlist)
                // console.log(JSON.stringify(amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken));
                checkOrderIdDuplicate(amazonORDERSlist);
              }//closing else theres still an amazonORDERSlist array

      }//closing checkifNEXTTOKEN 
//////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////
//Regular function routes for order lists without nextToken 
var checkOrderIdDuplicate = function(amazonORDERSlist){
// console.log('amazonOrderItemsSave' + JSON.stringify(amazonOrderItemsSave.itemsArray))
console.log('amazonPrevOrderList.orderListArray frm checkOrderIdDuplicate ' + JSON.stringify(amazonPrevOrderList.orderListArray))

            if (amazonPrevOrderList.orderListArray && amazonPrevOrderList.orderListArray.length) {
              for (h = 0; h < amazonPrevOrderList.orderListArray.length; h++) {
                for (i = 0; i < amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order.length; i++) {
                        for (j = 0; j < amazonPrevOrderList.orderListArray[h].ListOrdersResponse.ListOrdersResult.Orders.Order.length; j++) {
                    if (amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order[i].AmazonOrderId == amazonPrevOrderList.orderListArray[h].ListOrdersResponse.ListOrdersResult.Orders.Order[j].AmazonOrderId) {
                  
                  var amazonOrderid = amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order[i].AmazonOrderId 
                  amazonDuplicateOrders.push2array(amazonOrderid)
                  var thisorder = amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order[i]
                  var removedOrders = amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order.splice(i,1)
                        console.log('this orderid is a duplicate frm last orderlist' + amazonOrderid)
                        console.log('removedOrders frm last orderlist LOOP' + JSON.stringify(removedOrders))
                         console.log('Updated amazonORDERSlist inside orderlist LOOP' + JSON.stringify(amazonORDERSlist))

                      


                   }//closing if amazonOrderid matches already entered amazonid
                  }//closing amazonOrderItemsSave for loop
              }//closing amazonORDERSlist for loop
          }//closing amazonOrderItemsSave.itemsArray loop
          console.log('amazonDuplicateOrders frm last orderlist LOOP' + amazonDuplicateOrders.duplicatesArray)
          console.log('Updated amazonORDERSlist frm outside last orderlist LOOP' + JSON.stringify(amazonORDERSlist))
      
           if (amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order && amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order.length) {
          orderListLoop(amazonORDERSlist);
      }//closing if theres still an amazonORDERSlist array
      
        else{
          console.log('No More New Orders yet')
        }//closing else theres still an amazonORDERSlist array

           }//closing first if 

  else {
    console.log('AOItemsSave undefined so just sending to orderListLoop')
    orderListLoop(amazonORDERSlist);
    amazonPrevOrderList.push2array(amazonORDERSlist);
           }//closing amazonOrderSave if doesn't exits statement



};//closing checOrderIdDuplicate
///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var orderListLoop = function(amazonORDERSlist) {

        var i = 0, howManyTimes = amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order.length;
                  
        function f() {
          var amazonOrderid = amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order[i].AmazonOrderId;
           var done = function(){
            console.log('itemFinder is DONE frm orderListLoop' + amazonOrderid)

           }
           console.log('amazonOrderid frm amazonOrderid loop' + amazonOrderid);
            itemFinder(amazonOrderid);
            i++;
            if( i < howManyTimes ){
                setTimeout( f, 3000 ); // running setTimeout recursively until we hit end of orderlist length
            }
        } //closing f

        f(); // invoking f

    };//closing orderListLoop

/////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////




       function nextToken(nexTToken, amazonORDERSlist) {

          console.log('nexTToken frm nextToken' + nexTToken);

            let ordersNextToken = {
            path: '/Orders/2013-09-01',
            query: {
                  Action: 'ListOrdersByNextToken',
                  // CreatedAfter: date.toISOString(),
                  'NextToken': nexTToken,
                   Version: '2013-09-01'
                   }// closing query
                } //closing ordersNextToken object

                 mws.request(ordersNextToken, function(e, result1) {
                 console.log('results1 frm mws NextToken req ' + JSON.stringify(result1));
                 // amazonOrderItemsSave.push2array(result1);
                 var orderItems1 = JSON.stringify(result1);
                 var orderItems2 = JSON.parse(orderItems1);
                  var orderItems = JSON.stringify(orderItems2);
                  // amazonOrderItemsSave.push2array(orderItems2);
                  // console.log('orderItems2 frm nextToken ' + JSON.stringify(orderItems2));


          ///////////////////////////////////////////////////////////////////////////////////////////////
          //function to loop thru and merge the next token results with previous list while checking for duplicates
                  function mergeOrdersNextTokenUnique(array) {
                  var a = array.concat();
                  for(var i=0; i<a.length; ++i) {
                      for(var j=i+1; j<a.length; ++j) {
                          if(a[i].AmazonOrderId === a[j].AmazonOrderId)
                              a.splice(j--, 1);
                      }
                  }

                  return a;
              }
          ///////////////////////////////////////////////////////////////////////////////////////////////
          // var mergedUniqueOrders;

                  if (orderItems2.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult.NextToken) {
            var nexTToken2 = orderItems2.ListOrdersResponse.ListOrdersResult.NextToken
            console.log('NEXTTOKEN Exists AGAIN, concatenating to lastNextTokken list & Sending 2 nextToken function AGAIN' + nexTToken2)
            var mergedUniqueOrders = mergeOrdersNextTokenUnique(amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order.concat(orderItems2.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult.Orders.Order));
                    nextToken(nexTToken2, mergedUniqueOrders)
                }//closing if theres a next token in the amazonORDERSlist array statement
                
                  else{
                    var mergedUniqueOrders = mergeOrdersNextTokenUnique(amazonORDERSlist.ListOrdersResponse.ListOrdersResult.Orders.Order.concat(orderItems2.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult.Orders.Order));
                    console.log('No 2nd nextToken, Sending 2 nextTokencheckOrderIdDuplicate NOW' + JSON.stringify(mergedUniqueOrders))
                    // console.log('amazonORDERSlist' + amazonORDERSlist)
                    // console.log(JSON.stringify(amazonORDERSlist.ListOrdersResponse.ListOrdersResult.NextToken));
                               console.log('about 2 Send mergedUniqueOrders frm nextToken 2 nextTokencheckOrderIdDuplicate ');
                     nextTokencheckOrderIdDuplicate(mergedUniqueOrders);

                 // loopThruItems(orderItems2, amazonOrderid, done);

           console.log('after sending mergedUniqueOrders frm nextToken End ');
                  }//closing else theres still an amazonORDERSlist array
          //////////////////////////////////////////////////////////////////////////////////////////

            }); // closing nextToken mws request
          } // closing nextToken function

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



 function nextTokencheckOrderIdDuplicate(mergedUniqueOrders){
// console.log('amazonOrderItemsSave' + JSON.stringify(amazonOrderItemsSave.itemsArray))
console.log('amazonPrevOrderList.orderListArray frm checkOrderIdDuplicate ' + JSON.stringify(amazonPrevOrderList.orderListArray))


var addMergedOrder2Prev = {};
addMergedOrder2Prev.ListOrdersResponse = {};
addMergedOrder2Prev.ListOrdersResponse.ListOrdersResult = {};
addMergedOrder2Prev.ListOrdersResponse.ListOrdersResult.Orders = {};
addMergedOrder2Prev.ListOrdersResponse.ListOrdersResult.Orders.Order = [];



            if (amazonPrevOrderList.orderListArray && amazonPrevOrderList.orderListArray.length) {
              for (h = 0; h < amazonPrevOrderList.orderListArray.length; h++) {
                for (i = 0; i < mergedUniqueOrders.length; i++) {
                        for (j = 0; j < amazonPrevOrderList.orderListArray[h].ListOrdersResponse.ListOrdersResult.Orders.Order.length; j++) {
                    if (mergedUniqueOrders[i].AmazonOrderId == amazonPrevOrderList.orderListArray[h].ListOrdersResponse.ListOrdersResult.Orders.Order[j].AmazonOrderId) {
                  
                  var amazonOrderid = mergedUniqueOrders[i].AmazonOrderId 
                  var removedOrders = mergedUniqueOrders.splice(i,1)
                  amazonDuplicateOrders.push2array(amazonOrderid)

                        console.log('this orderid is a duplicate frm last orderlist' + amazonOrderid)


                   }//closing if amazonOrderid matches already entered amazonid
                  }//closing amazonOrderItemsSave for loop
              }//closing amazonORDERSlist for loop
          }//closing amazonOrderItemsSave.itemsArray loop
          console.log('amazonDuplicateOrders frm last orderlist LOOP' + amazonDuplicateOrders.duplicatesArray)
          // console.log('Updated amazonORDERSlist frm outside last orderlist LOOP' + JSON.stringify(amazonORDERSlist))
      
           if (mergedUniqueOrders && mergedUniqueOrders.length) {
            console.log('Some New Orders to send2 nextTokenorderListLoop')
            nextTokenorderListLoop(mergedUniqueOrders);
            addMergedOrder2Prev.ListOrdersResponse.ListOrdersResult.Orders.Order.push(mergedUniqueOrders);
            amazonPrevOrderList.push2array(addMergedOrder2Prev);
            // console.log('amazonPrevOrderList after sending2 nextTokenorderListLoop YES prevOrderList route' + JSON.stringify(amazonPrevOrderList));
        }//closing if theres still an amazonORDERSlist array
      
        else{
          console.log('No More New Orders yet')
        }//closing else theres still an amazonORDERSlist array

           }//closing first if 



  else {
    console.log('AOItemsSave undefined so just sending straight to orderListLoop')
    nextTokenorderListLoop(mergedUniqueOrders);
    addMergedOrder2Prev.ListOrdersResponse.ListOrdersResult.Orders.Order.push(mergedUniqueOrders);    
    amazonPrevOrderList.push2array(addMergedOrder2Prev);
    // console.log('amazonPrevOrderList after sending2 nextTokenorderListLoop NO prevOrderList route' + JSON.stringify(amazonPrevOrderList));
           }//closing amazonOrderSave if doesn't exits statement






}//closing nextTokenchecOrderIdDuplicate
//////////////////////////////////////////////////////////////////////////////////////////////////


function nextTokenorderListLoop(mergedUniqueOrders) {





        var i = 0, howManyTimes = mergedUniqueOrders.length;
                  
        function f() {
          var amazonOrderid = mergedUniqueOrders[i].AmazonOrderId;
           
            console.log('sending to itemFinder frm NexTTOKENorderListLoop' + amazonOrderid)

           
           console.log('amazonOrderid frm amazonOrderid loop' + amazonOrderid);
            itemFinder(amazonOrderid);
            i++;
            if( i < howManyTimes ){
                setTimeout( f, 3000 ); // running setTimeout recursively until we hit end of orderlist length
            }
        } //closing f

        f(); // invoking f






    };//closing nextTokenorderListLoop
//////////////////////////////////////////////

function itemFinder(amazonOrderid) {

console.log('amazonOrderid frm itemFinder loop' + amazonOrderid);

  let listOrderItems = {
  path: '/Orders/2013-09-01',
  query: {
        Action: 'ListOrderItems',
        // CreatedAfter: date.toISOString(),
        'AmazonOrderId': amazonOrderid,
         Version: '2013-09-01'
         }// closing query
      } //closing listorderitems object

       mws.request(listOrderItems, function(e, result1) {
       // console.log('results1 frm mws listOrderItems req ' + JSON.stringify(result1));
       // amazonOrderItemsSave.push2array(result1);
       var orderItems1 = JSON.stringify(result1);
       var orderItems2 = JSON.parse(orderItems1);
        var orderItems = JSON.stringify(orderItems2);
        amazonOrderItemsSave.push2array(orderItems2);


       
            console.log('sending to loopThruItems frm itemFinder mws req callback')

           



       loopThruItems(orderItems2, amazonOrderid);

       // return orderItems
  }); // closing mws request
} // closing itemFinder
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loopThruItems(listOrderItems, amazonOrderid) {


var singleOrder = [];
var multiOrders = [];
      if (listOrderItems.ListOrderItemsResponse.ListOrderItemsResult.OrderItems.OrderItem.SellerSKU) {
          sellerSKU = listOrderItems.ListOrderItemsResponse.ListOrderItemsResult.OrderItems.OrderItem.SellerSKU;
          quantityOrdered = listOrderItems.ListOrderItemsResponse.ListOrderItemsResult.OrderItems.OrderItem.QuantityOrdered;
           // amazonorderid = listOrderItems.ListOrderItemsResponse.ListOrderItemsResult.OrderItems.AmazonOrderId;

           orderItems = {
            sku: sellerSKU,
            quantity: quantityOrdered,
            amazonOrder: amazonOrderid
          };
          console.log('orderItems frm loopThruItems SINGLE ITEM ' + JSON.stringify(orderItems));
          singleOrder.push(orderItems);
          console.log('singleOrders frm loopThruItems SINGLE ITEM ' + JSON.stringify(singleOrder));

          ///////////////// Begin added inner loop to get items ready2 Decrement 
            for (l = 0; l < allShopifyProducts.products.length; l++)
            {
              for (i = 0; i < allShopifyProducts.products[l].variants.length; i++) {

                for (k = 0; k < singleOrder.length; k++)
            { 
              //access order info here
              if(singleOrder[k].sku == allShopifyProducts.products[l].variants[i].sku) {
               
               var amazonItemReady2dec = {}

               var total_weight2_decrement = allShopifyProducts.products[l].variants[i].weight * singleOrder[k].quantity

               console.log('total_weight2_decrement frm loopThruItems SINGLE ITEM ' + total_weight2_decrement);

               amazonItemReady2dec = {
                orderWeight: total_weight2_decrement,
                productid: allShopifyProducts.products[l].variants[i].sku,
                variantId: allShopifyProducts.products[l].variants[i].id,
                amazonorderid: singleOrder[k].amazonOrder,
                productNEWTotalWeight: 0,
                thisVariantsWeight: allShopifyProducts.products[l].variants[i].weight,
                variantUPDatedQuantity: 0

               } // closing amazonItemReady2dec object
               console.log('amazonItemReady2dec frm productCodes inner Loop Single ITEM ' + JSON.stringify(amazonItemReady2dec));
               // itemsReady2dec.push(amazonItemReady2dec);

            
                   console.log('sending to updateWhInvAWS frm productCodes inner Loop Single items path')

               
                 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////








               updateWhInvAWS(amazonItemReady2dec);
                
              }//closing single order sku to shopify variant sku if statement block

    
             }// closing single orders for loop
            }// closing shopify product variants for loop
           }// closing shopify products for loop

/////////////////  End added inner loop to get items ready2 Decrement 

      } //closing if statement true block 

      else {

        for (j = 0; j < listOrderItems.ListOrderItemsResponse.ListOrderItemsResult.OrderItems.OrderItem.length; j++)
        {
          sellerSKU = listOrderItems.ListOrderItemsResponse.ListOrderItemsResult.OrderItems.OrderItem[j].SellerSKU;
          quantityOrdered = listOrderItems.ListOrderItemsResponse.ListOrderItemsResult.OrderItems.OrderItem[j].QuantityOrdered;
          // amazonorderid = listOrderItems.ListOrderItemsResponse.ListOrderItemsResult.OrderItems.OrderItem[j].AmazonOrderId;

           orderItems = {
            sku: sellerSKU,
            quantity: quantityOrdered,
            amazonOrder: amazonOrderid
          };
          
          multiOrders.push(orderItems);
          console.log('orders frm listOrderItems loop in loopThruItems Multiple ITEM ' + JSON.stringify(multiOrders));
///////////////// Begin added inner loop to get items ready2 Decrement 
            for (k = 0; k < allShopifyProducts.products.length; k++)
            {
              for (i = 0; i < allShopifyProducts.products[k].variants.length; i++) {

              //access order info here
                  console.log('orders frm orders loop in loopThruItems Multiple ITEM ' + JSON.stringify(multiOrders));
                  var l = 0, howManyTimes = multiOrders.length;
                            
                  function f() {
                    console.log('orders frm inside productcodes timeOut Loop in loopThruItems Multiple items path ' + JSON.stringify(multiOrders));
                    console.log('orders[k] frm inside productcodes timeOut Loop in loopThruItems Multiple items path ' + multiOrders[l]);
                    if(multiOrders[l].sku == allShopifyProducts.products[k].variants[i].sku) {
               
                               var amazonItemReady2dec = {}

                               var total_weight2_decrement = allShopifyProducts.products[k].variants[i].weight * multiOrders[l].quantity
                               console.log('total_weight2_decrement frm loopThruItems Multiple items path ' + total_weight2_decrement);
                               amazonItemReady2dec = {
                                orderWeight: total_weight2_decrement,
                                productid: allShopifyProducts.products[k].variants[i].sku,
                                variantId: allShopifyProducts.products[l].variants[i].id,
                                amazonorderid: multiOrders[l].amazonOrder,
                                productNEWTotalWeight: 0,
                                thisVariantsWeight: allShopifyProducts.products[l].variants[i].weight,
                                variantUPDatedQuantity: 0

                               } // closing amazonItemReady2dec object





                               console.log('amazonItemReady2dec frm productCodes inner Loop Multiple items path ' + amazonItemReady2dec);
                               // itemsReady2dec.push(amazonItemReady2dec);

                             
                                  console.log('sending to updateWhInvAWS frm productCodes inner Loop Multiple items path')

                             



                               updateWhInvAWS(amazonItemReady2dec);

                   


                      l++;
                      if( l < howManyTimes ){
                          setTimeout( f, 3000 ); // running setTimeout recursively until we hit end of itemsReady2GO length
                      }
                  } //closing f

                  f(); // invoking f
               }//closing if statement block
              //////////////////////////////////////////// Begin productcodes for loop
             }// cosing allShopifyProducts.products[l].variants
            }// closing orders for loop

/////////////////  End added inner loop to get items ready2 Decrement 
          
        }//closing listOrderItems for loop

      } // closing else ,is array, block 
// matchOrdersProductCodesGetWt2Dec();
      // done();
} //closing loopThruItems  

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateWhInvAWS(amazonItemReady2dec){
console.log("starting updateWhInvAWS")
              db("cflsys_warehouse_inventory")
                   
                                  .select('productid', 'weight as total') 
                                  .groupBy("productid")
                                  .orderBy("productid")
                                  .sum("weight as total")
                                  .then((result) => {
                                    console.log('getsum worked ')
                    for (j = 0; j < result.length; j++) {
                      if(result[j].productid = amazonItemReady2dec.productid) {
                      amazonItemReady2dec.productNEWTotalWeight =  result[j].total - amazonItemReady2dec.orderWeight
                      amazonItemReady2dec.variantUPDatedQuantity = amazonItemReady2dec.productNEWTotalWeight / amazonItemReady2dec.thisVariantsWeight
                      




                                    }//closing if result productid matches amazon item productid if statement


                                    else {
                                      console.log("no warehouse matches from recent amazon orders - SINGLE ITEM")
                                    }
                                }//closing for WH total weight result for loop


                                console.log("made through WH Total loop " + amazonItemReady2dec)
                                


                  })//closing WH Total result then promise
                                .then((result) => {
                                     console.log("about to start WH update then " + amazonItemReady2dec)
                                  db("cflsys_warehouse_inventory")
                                   .select('productid', 'weight') 
                                   .groupBy("productid")
                                   .orderBy("productid")
                                   .where({
                                      productid: amazonItemReady2dec.productid
                                  })
                                  .first()
                                  .update('weight', amazonItemReady2dec.productNEWTotalWeight)// closing update promise
                                  .then((result) => {
                                    console.log("After success updateWhInvAWS decrementing this Order Amazonorderid " + amazonItemReady2dec.amazonorderid + "frm MySql WH inventory!!!" + JSON.stringify(result))
                                       getCurrentInvWeight(amazonItemReady2dec);
                                       // updateProducts(amazonItemReady2dec);
                                  })// closing update then result promise
                                })//closing 2nd then from 1st WH inv getsum result
                                .catch(function (error) {
                                    // oops, shopify is angered
                                    console.log("did not update WH Mysql db" + error);
                                 // output: 'shopify is not happy...'
                                });
                                  console.log('sending getCurrentInvWeight frm updateWhInvAWS path')

                               
                                    // updateProducts(amazonItemReady2dec);
                              }//closing updateWhInvAWS function 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
function getCurrentInvWeight(amazonItemReady2dec) {
    console.log('amazonItemReady2dec frm getCurrentInvWeight Beginning ' + JSON.stringify(amazonItemReady2dec));

// Shopify.get('https://wiredin-solutions.myshopify.com/admin/products.json', function(err, data, headers){

  amazonItemReady2dec.variantUPDatedQuantity = Math.floor(amazonItemReady2dec.variantUPDatedQuantity);
// });


updateProducts(amazonItemReady2dec);


};    // closing getCurrentInvWeight function
////////////////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////
// call our update promise
function updateProducts(amazonItemReady2dec) {
    shopifyUpdateProducts(amazonItemReady2dec)
        .then(function (fulfilled) {
            // yay, we got products
            console.log("UPDATING Products FULFILLED!!!!!   ");
         // 
        })
        .catch(function (error) {
            // oops, shopify is angered
            console.log(error.message);
         // output: 'shopify is not happy...'
        });
};


//////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







module.exports = {

checkifNEXTTOKEN:checkifNEXTTOKEN,
nextToken:nextToken,
checkOrderIdDuplicate:checkOrderIdDuplicate,
// mergeOrdersNextTokenUnique:mergeOrdersNextTokenUnique,
nextTokencheckOrderIdDuplicate:nextTokencheckOrderIdDuplicate,
nextTokenorderListLoop:nextTokenorderListLoop,
itemFinder:itemFinder,
loopThruItems:loopThruItems,
updateWhInvAWS:updateWhInvAWS,
getCurrentInvWeight:getCurrentInvWeight,
updateProducts:updateProducts





}//closing module.exports object