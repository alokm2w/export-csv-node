const express = require('express');
// const bodyparser = require('body-parser');
const cron = require("node-cron");
const CsvHelper = require('./app/helpers/CsvHelper');
const SqlQueries = require('./app/models/SqlQueries')
const dbconn = require('./app/databases/dbconnection');
const fs = require('fs');
const path = require('path');
const Json2Csv = require('json2csv');
var rimraf = require("rimraf");
const routes = require('./routes/index');
require('dotenv').config();
var app = express();
process.env.TZ = 'Europe/Amsterdam'; //set timezone

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static("public"));

// app.use(bodyparser.json());
app.use(routes);

var server = app.listen(process.env.DEV_PORT, () => {
    server.timeout = 2000000;
    console.log(`Server is running on url "${process.env.APPURL}"`);
});

cron.schedule("00 00 14 * * *", () => {
    console.log("Cron Scheduler Start");
    exportcsv();
    console.log("Running a task at " + CsvHelper.currentDateTime());
});

function exportcsv() {

    var sqlQuery = SqlQueries.query.orders.get_orders_detail;

    dbconn.query(sqlQuery, function (error, data, fields) {

        if (error) {
            throw error;
        } else {
            var filename = 'OrdersList_' + CsvHelper.currentDateTime();
            const zipFileDir= './public/ordersList'
            // delete ordersList dir.
            rimraf(zipFileDir, function () { genrateCSV() });

            function genrateCSV(){
                const csvArr = CsvHelper.genOrdersArr(data)
                const json2csvParser = new Json2Csv({ delimiter: ';' });
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
        }
    });
}