const express = require('express');
const bodyparser = require('body-parser');
const dbconn = require('../databases/dbconnection');
const { Parser } = require('json2csv');
const fs = require('fs');
const SqlQueries  = require('../models/SqlQueries');
const CsvHelper = require('../helpers/CsvHelper');
require('dotenv').config();
var app = express();
app.use(bodyparser.json());
var rimraf = require("rimraf");

module.exports =  async (req, res) => {

    var sqlQuery =SqlQueries.query.orders.get_orders_detail;
    console.log('start fetching records', CsvHelper.currentDateTime())
    dbconn.query(sqlQuery, async function (error, data, fields) {
        if (error) {
            throw error;
        } else {
            console.log('start execution', CsvHelper.currentDateTime());
            var filename = 'OrdersList_' + CsvHelper.currentDateTime();
            const zipFileDir= './public/ordersList'
            // delete ordersList dir.
            rimraf(zipFileDir, function () { genrateCSV() });

            function genrateCSV(){
                console.log('start generating csv', CsvHelper.currentDateTime());
                const csvArr = CsvHelper.genOrdersArr(data)
                const json2csvParser = new Parser({ delimiter: ';' });
                const csv = json2csvParser.parse(csvArr);

                // create temp directory
                const dir = './temp'
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }

                // store csv file into temp dir
                fs.writeFileSync(`temp/${filename}.csv`, csv)

                // convert to zip
                CsvHelper.genCsvToZip(zipFileDir, filename)
            }

            res.render('index', {
                title: 'service point',
                filename: `${filename}.zip`,
                orderFileLink: `${process.env.APPURL}/download-orders-list/${filename}`,
                productFileLink: '',
            });
        }
    });
};