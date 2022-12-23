const DecodeData = require('./DecodeData');
const fs = require('fs');
const { zip } = require('zip-a-folder');
var rimraf = require("rimraf");
const EmailHelper = require('./EmailHelper');

const currentDateTime = () => {
    // get current date
    var today = new Date();
    var day = ("0" + today.getDate()).slice(-2);
    var month = ("0" + (today.getMonth() + 1)).slice(-2);
    var year = today.getFullYear();
    var hour = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var date = day + "-" + month + "-" + year + "_" + hour + "_" + minutes + "_" + seconds;
   return date
}

async function genCsvToZip(zipFileDir, filename){
    console.log('start converting to zip', currentDateTime());
    if (!fs.existsSync(zipFileDir)){
        fs.mkdirSync(zipFileDir);
    }

    await zip('./temp', `${zipFileDir}/${filename}.zip`);

    rimraf('./temp', function () {
        EmailHelper.send_mail();
        console.log('Done!', currentDateTime());
    });
    // delete csv file
    // const result = findRemoveSync('./orderscsv', { extensions: ['.csv'] })
}

const genOrdersArr = (ArrData) => {
    var myArr = new Array();
    for (var i = 0; i < ArrData.length; i++) {
        var row = ArrData[i];

        var orderDetails = {
            "S.No.": i+1,
            "Order ID": row['Order ID'],
            "OrderDetail ID": row['OrderDetail ID'],
            "Order Number": row['Order Number'],
            "Order Status": DecodeData.replaceOrderStatus(row['Order Status']),
            "Order Financial Status": row['Order Financial Status'],
            "Store Name": row['Store Name'],
            "Product Name": DecodeData.deAccentData(row['Product Name']),
            "Product Variant": DecodeData.deAccentData(row['Product Variant']),
            "shopify_order_detail_id": row['shopify_order_detail_id'],
            "admin_graphql_api_id": DecodeData.deAccentData(row['admin_graphql_api_id']),
            "fulfillable_quantity": row['fulfillable_quantity'],
            "IOSS Number": DecodeData.deAccentData(row['IOSS Number']) ? DecodeData.deAccentData(row['IOSS Number']) : '0000',
            "Product Image Link": DecodeData.deAccentData(row['Product Image Link']),
            "Link of Product Page": DecodeData.deAccentData(row['Link of Product Page']),
            "Product Id and Variant Name": DecodeData.deAccentData(row['Product Id and Variant Name']),
            "Gift Card": row['Gift Card'],
            "Grams/gm": row['Grams/gm'],
            "Price": DecodeData.changeAmountFormat(row['Price']),
            "Shopify Product ID": row['Shopify Product ID'],
            "Quantity": row['Quantity'],
            "SKU": DecodeData.deAccentData(row['SKU']),
            "Total Discount": row['Total Discount'],
            "shopify_variant_id": row['shopify_variant_id'],
            "account_details_id": row['account_details_id'],
            "quotation_id": row['quotation_id'],
            "supplier_account_details_id": row['supplier_account_details_id'],
            "supplier name": DecodeData.deAccentData(row['supplier name']),
            "quote_price": DecodeData.changeAmountFormat(row['quote_price']),
            "is_amount_deducted": row['is_amount_deducted'],
            "is_exchange_order": row['is_exchange_order'],
            "is_shipped": row['is_shipped'],
            "Customer Name": DecodeData.deAccentData(row['Customer Name']),
            "Paid by shop owner": row['Paid by shop owner'],
            "Date of payment": DecodeData.deAccentData(row['Date of payment']),
            "Customer Phone Number": DecodeData.deAccentData(row['Customer Phone Number']),
            "Customer Email": DecodeData.deAccentData(row['Customer Email']),
            "Address1": DecodeData.deAccentData(row['Address1']),
            "Address2": DecodeData.deAccentData(row['Address2']),
            "City": DecodeData.deAccentData(row['City']),
            "Province": DecodeData.deAccentData(row['Province']),
            "Province Code": DecodeData.deAccentData(row['Province Code']),
            "Country": DecodeData.deAccentData(row['Country']),
            "Country Code": DecodeData.deAccentData(row['Country Code']),
            "Zip Code": DecodeData.deAccentData(row['Zip Code']),
            "Company": DecodeData.deAccentData(row['Company']),
            "latitude": DecodeData.deAccentData(row['latitude']),
            "longitude": DecodeData.deAccentData(row['longitude']),
            "Intransit Date": (row['Intransit Date'] == '-' || row['Intransit Date'] == '00-00-0000') ? '' : row['Intransit Date'],
            "Max Processing Time": DecodeData.deAccentData(row['Max Processing Time']),
            "Max Delievery Time": DecodeData.deAccentData(row['Max Delievery Time']),
            "Admin supplier name": DecodeData.deAccentData(row['Admin supplier name']),
            "Agent support name": DecodeData.deAccentData(row['Agent support name']),
            "order_tracking_number": DecodeData.deAccentData(row['order_tracking_number']),
            "Order Created Date": row['Order Created Date'],
            "Order Processing Date": DecodeData.deAccentData(row['Order Processing Date']),
            "Client Name": DecodeData.deAccentData(row['Client Name']),
            "Fee/Order": DecodeData.changeAmountFormat(row['Fee/Order']),
            "Affiliate Fee": DecodeData.changeAmountFormat(row['Affiliate Fee']),
            "Agent Fee": DecodeData.changeAmountFormat(row['Agent Fee']),
        };
        myArr.push(orderDetails);
    }
    return myArr
}

const genProductsArr = (ArrData) => {
    var myArr = new Array();

    for (var i = 0; i < ArrData.length; i++) {
        var row = ArrData[i];

        var status = DecodeData.replaceProductStatus(row['product_status']);

        // Add Varient And Country (According to Status) With Quotation Status
        status = (row['is_new_variant'] == 1) ? status + ' - New variant' : status;
        status = (row['is_add_country'] == 1) ? status + ' - Add country' : status;

        var productDetails = {
            "S No": i+1,
            "Product ID": row['product_store_id'],
            "Variant Id": row['shopify_variant_id'],
            "Store Name": row['store_name'],
            "Product Name": DecodeData.deAccentData(row['productName']),
            "Variant Name": DecodeData.deAccentData(row['variant_name']),
            "1 Unit Price": row['1price'],
            "2 Unit Price": row['2price'],
            "3 Unit Price": row['3price'],
            "4 Unit Price": row['4price'],
            "Fee Per Order": row['fee_per_order'],
            "Country Name": row['country_name'],
            "Admin Supplier": DecodeData.deAccentData(row['admin_supplier_name']),
            "Agent Supplier": DecodeData.deAccentData(row['agent_supplier_name']),
            "Status": status,
        };
        myArr.push(productDetails);
    }
    return myArr
}

module.exports = { currentDateTime, genOrdersArr, genCsvToZip, genProductsArr }