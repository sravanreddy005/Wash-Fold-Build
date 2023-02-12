const Sequelize = require('sequelize');
const winston = require('../helpers/winston');
const { AdminModels, OrdersModels } = require('../database');
const { validateUserLogin, getAccessAndRefreshTokens } = require('./AuthController');
const { validateData, generatePasswordHashSalt, generateHashSaltUsingString, stringToSlug, genarateAccessToken } = require('../helpers/common');
const { sendWhatsappMessage, amountInwords, formatDate, getSumByKey, parseExcel } = require('../helpers/common');
const { passwordRegx, alnumRegx } = require('../helpers/regExp');
const { sendMail } = require('../helpers/email');
const fs = require('fs');
const Op = Sequelize.Op;
const sharp = require('sharp');

const pdf = require('html-pdf');
const {promisify} = require('util');
const read = promisify(require('fs').readFile);
const handlebars = require('handlebars');

handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

const { getRecordsFromDB } = require('../services/AdminService');

const {  
    addRecordToDB: addOrdersRecordToDB,
    addBulkRecordsToDB: addOrdersBulkRecordsToDB,
    getRecordsFromDB: getOrderRecordsFromDB,
    getRecordsWithJoinFromDB: getOrderRecordsWithJoinFromDB,
    getOneRecordFromDB: getOneOrderRecordFromDB,
    getOneRecordWithJoinFromDB: getOneOrderRecordWithJoinFromDB,
    updateRecordInDB: updateOrderRecordInDB,
} = require('../services/OrdersService');


/**************************** STARTED ORDERS ***************************/
/**
 * storing the orders
 */
module.exports.addOrder = async (req, res, next) => {
    try {
        let reqBody = req.body;
        console.log('reqBody', reqBody);
        if(
            reqBody &&
            reqBody.first_name && validateData('alnum', reqBody.first_name) && 
            reqBody.last_name && validateData('alnum', reqBody.last_name) && 
            reqBody.email && validateData('email', reqBody.email) && 
            reqBody.mobile_number && validateData('mobile', reqBody.mobile_number) &&
            reqBody.pickup_date &&
            reqBody.pickup_time_slot &&
            reqBody.drop_date &&
            reqBody.drop_time_slot &&
            reqBody.pincode && validateData('pincode', reqBody.pincode) &&
            reqBody.address1 && validateData('address', reqBody.address1) &&
            reqBody.address2 && validateData('address', reqBody.address2) &&
            reqBody.payment_type &&
            reqBody.cart_items
        ){
            let orderID = new Date().getTime();
            let pickupTimeData = JSON.parse(reqBody.pickup_time_slot);
            let dropTimeData = JSON.parse(reqBody.drop_time_slot);
            let reqData = {
                order_id: orderID,
                first_name: reqBody.first_name,
                last_name: reqBody.last_name,
                email: (reqBody.email).toLowerCase(),
                mobile_number: reqBody.mobile_number,
                pickup_date: reqBody.pickup_date,
                pickup_time_slot: pickupTimeData.from_time+ ' - ' +pickupTimeData.to_time,
                drop_date: reqBody.drop_date,
                drop_time_slot: dropTimeData.from_time+ ' - ' +dropTimeData.to_time,
                pincode: reqBody.pincode,
                city: reqBody.city,
                address1: reqBody.address1,
                address2: reqBody.address2,
                payment_type: reqBody.payment_type,
                order_status: 'PENDING'
            }
            const customerInfoResp = await addOrdersRecordToDB(reqData, 'CustomerInfo', false);
            if(customerInfoResp){
                let orderData = [];
                let productIDs = reqBody.cart_items.map(data => data.id);
                const productsInfo = await getRecordsFromDB('Products', false, {id: {[Op.in]:productIDs}});
                productsInfo.map((value) => {
                    let quantity = reqBody.cart_items.filter(val => val.id === value.id)[0].quantity;
                    let data = {
                        order_id: orderID,
                        product_id: value.id,
                        product_price: value.product_price,
                        quantity: quantity,
                        total_price: (parseInt(quantity) * parseFloat(value.product_price)).toFixed(2),
                    }  
                    orderData.push(data);              
                });
                console.log('orderData', orderData);
                const ordersResp = orderData.length > 0 ? await addOrdersBulkRecordsToDB(orderData, 'Orders', false) : null;
                console.log('ordersResp', ordersResp);
                if(ordersResp){
                    return res.status(200).json({
                        responseCode: 1, 
                        message: "Details successfully added",
                        orderID: orderID, 
                        status: 'SUCCESS'
                    });
                }else{
                    return res.status(200).json({responseCode: 0, message: "Details adding has failed"});
                }                
            }else{
                return res.status(200).json({responseCode: 0, message: "Details adding has failed"});
            }             
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message: "Bad Request"});
        }        
    }catch (err) {
        console.log('error', err);
        return next(err);
    }
}

/**
 * fetching the order details
 */
 module.exports.getOrderDetails = async (req, res, next) => {
    try {
        console.log('req.body', req.body);
        if(req.body && req.body.order_id){
            let whereData = {'order_id': (req.body.order_id).toString()};
            let includeData = [ 
                { 
                    model: OrdersModels.Orders, 
                    attributes: ["product_price", "quantity", "total_price"], 
                    required: true, 
                    include: [{ 
                        model: AdminModels.Products, 
                        attributes: ["product_name", "product_image"], 
                        required: true, 
                    }]
                }                
            ];
            console.log('includeData', includeData);
            const resp = await getOneOrderRecordWithJoinFromDB('CustomerInfo', whereData, includeData);
            console.log('resp', resp);
            return res.status(200).json({responseCode: 1, message: "success", orderInfo: resp});  
        }else{
            res.status(400).json({responseCode: 0, message: "Bad Request"});      
        }        
    }catch (err) {
        console.log('err', err);
        return next(err);
    }
}

/**
 * fetching the orders list
 */
 module.exports.getOrdersList = async (req, res, next) => {
    try {
        let whereData = {};
        let includeData = [ 
            { 
                model: OrdersModels.Orders, 
                attributes: ["product_price", "quantity", "total_price"], 
                required: true, 
                include: [{ 
                    model: AdminModels.Products, 
                    attributes: ["product_name", "product_image"], 
                    required: true,
                    include: [{ 
                        model: AdminModels.ProductTypes, 
                        attributes: ["product_type"], 
                    },
                    { 
                        model: AdminModels.Categories, 
                        attributes: ["category_name"], 
                    }] 
                }]
            }                
        ];
        console.log('includeData', includeData);
        const resp = await getOrderRecordsWithJoinFromDB('CustomerInfo', whereData, includeData);
        console.log('resp', resp);
        return res.status(200).json({responseCode: 1, message: "success", list: resp});       
    }catch (err) {
        console.log('err', err);
        return next(err);
    }
}

/**
 * updating the status of orders
 */
module.exports.updateOrdersStatus = async (req, res, next) => {
    try {        
        console.log('req.body', req.body);
        if(req.body.id && req.body.status){

            let updateResp = await updateOrderRecordInDB('CustomerInfo', {order_status: req.body.status}, {id: req.body.id}, false);
            if(updateResp){
                return res.status(200).json({responseCode: 1, message: "success"});
            }else{
                return res.status(200).json({responseCode: 0, message: "Status updating has failed"});
            }
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Invalid request"});
        }               
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateOrdersStatus method': err.message });
        return next(err);
    }
}

/**************************** END ORDERS ***************************/
