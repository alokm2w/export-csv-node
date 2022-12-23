const express = require('express');
const bodyparser = require('body-parser');
const dbconn = require('../databases/dbconnection');
const SqlQueries  = require('../models/SqlQueries');
const CsvHelper = require('../helpers/CsvHelper');
const { Parser } = require('json2csv');
const fs = require('fs');
require('dotenv').config();
var app = express();
app.use(bodyparser.json());
var rimraf = require("rimraf");



module.exports =  async (req, res) => {

    var sqlQuery =SqlQueries.query.products.get_products_detail;
    console.log('start fetching records', CsvHelper.currentDateTime())
    dbconn.query(sqlQuery, function (error, data, fields) {
        if (error) {
            throw error;
        } else {
            console.log('start execution', CsvHelper.currentDateTime());
            var filename = 'ProductsLit_' + CsvHelper.currentDateTime();
            const zipFileDir= './public/productszip'
            // delete ordersList dir.
            rimraf(zipFileDir, function () { genrateCSV() });

            function genrateCSV(){
                console.log('start generating csv', CsvHelper.currentDateTime());
                const csvArr = CsvHelper.genProductsArr(data)
                const json2csvParser = new Parser({ delimiter: ';' });
                const csv = json2csvParser.parse(csvArr);

                // create temp directory
                const dir = './temp'
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }

                // store csv file into temp dir
                fs.writeFileSync(`temp/${filename}.csv`, csv)

                // convert csv to zip
                CsvHelper.genCsvToZip(zipFileDir, filename)
            }

            res.render('index', {
                title: 'service point',
                filename: `${filename}.zip`,
                productFileLink: `${process.env.APPURL}/download-products/${filename}`,
                orderFileLink: '',
            });
        }
    });
};