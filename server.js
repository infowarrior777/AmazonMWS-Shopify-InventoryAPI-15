
const shopifyAPI = require('shopify-node-api');
const express = require('express');
const path = require('path');
const app = express();

const Shopify = require("./Shopify")
const shopifyGetProducts = require("./shopifyGetProducts")
const shopifyUpdateProducts = require("./shopifyUpdateProducts")
const shopifyProducts = require("./shopifyProducts")
const amazonPrevOrderList = require("./amazonPrevOrderList")
const db = require("./db")

const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const users = require('./routes/users')
const homepage = require('./routes/homepage')
const shopifyVupdate = require('./routes/shopify-mws-variant-update')

const route_install = require('./routes/install');
const finish_auth = require('./routes/finish_auth');
require("babel-register");

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({'extended':'true'}));
app.use(bodyparser.json());
app.use(bodyparser.json({ type: 'application/vnd.api+json'}));
app.set("view engine", "hjs")
app.use(methodOverride());


app.use('/', homepage);
app.use('/shopify-update', shopifyVupdate);
app.use('/users', users);
app.use('/install', route_install);
app.use('/finish_auth', finish_auth);


app.listen(3000);
console.log('App listening on port 3000');

