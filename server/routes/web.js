const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');
const OrdersController = require('../controllers/OrdersController');


router.post('/getProducts', AdminController.getProducts);
router.post('/getLatestProducts', AdminController.getLatestProducts);
router.post('/getProductTypes', AdminController.getProductTypes);
router.post('/getCategories', AdminController.getCategories);
router.post('/getTimeSlots', AdminController.getTimeSlots);
router.post('/addOrder', OrdersController.addOrder);
router.post('/getOrderDetails', OrdersController.getOrderDetails);
router.post('/getTestimonials', AdminController.getActiveTestimonials);


module.exports = router;