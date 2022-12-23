var express = require('express');
var app = express.Router();
const convertcsv = require('../app/controllers/OrdersController');
const csvfileproduct = require('../app/controllers/ProductsController');
// const requestIp = require('request-ip');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

/* homepage */
app.get("/", (req, res) => {
    res.render('index', {
        title: 'Service Point',
        orderFileLink: '',
        productFileLink: '',
    });
});

/* GET export orders csv */
app.get('/api/convertcsv', convertcsv);

/* GET export products csv */
app.get('/api/csv-file-product', csvfileproduct);

/* download products zip */
app.get('/download-products/:filename?', function(req, res){
  const file = `./public/productszip/${req.params.filename}`;
  res.download(file);
});
/* download orders zip */
app.get('/download-orders-list/:filename?', function(req, res){
  const file = `./public/ordersList/${req.params.filename}`;
  res.download(file);
});

/* API orders zip */
app.get('/download-orders', function(req, res){
  // const clientIp = requestIp.getClientIp(req);
  // console.log('IP=', clientIp);
  if (!process.env.IP_ADDRESS.includes(req.ip) && 0) { /* Wrong IP address */
    res.send('permission denied');
  }else{
    var files = fs.readdirSync('./public/ordersList');
    storefilename = files[0];
    if(typeof(storefilename) != 'undefined'){
      res.sendFile(path.resolve("./"+`/public/ordersList/${storefilename}`));
    } else {
      res.send(`File Not Available:${storefilename}`);
    }
  }
});

module.exports = app;
