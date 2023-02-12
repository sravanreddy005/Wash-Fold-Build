const express = require('express');
const router = express.Router();
const jwt = require('../helpers/jwt');
const { uploadCSVFiles, uploadImages, uploadFiles } = require('../helpers/fileUpload');

const AdminController = require('../controllers/AdminController');
const OrdersController = require('../controllers/OrdersController');

router.post('/getAdminProfile', jwt.verifyAdminJwtToken, AdminController.getAdminProfile);
router.post('/updateAdminProfile', jwt.verifyAdminJwtToken, AdminController.updateProfile);
router.post('/updateAdminEmail', jwt.verifyAdminJwtToken, AdminController.updateEmail);
router.post('/updateAdminPassword', jwt.verifyAdminJwtToken, AdminController.updatePassword);

// router.post('/downLoadFiles', jwt.verifyAdminJwtToken, AdminController.downLoadFiles);
// router.post('/generateInvoicePDF', jwt.verifyAdminJwtToken, AdminController.generateInvoicePDF);

//Admin Modules
router.post('/getModules', jwt.verifyAdminJwtTokenWithAccess('modules-list', 'view'), AdminController.getModules);
router.post('/addModule', jwt.verifyAdminJwtTokenWithAccess('modules-list', 'edit'), AdminController.createModule);

//Role Types
router.post('/getRoleTypes', jwt.verifyAdminJwtTokenWithAccess('roles', 'edit'), AdminController.getRoleTypes);

//Roles
router.post('/createRole', jwt.verifyAdminJwtTokenWithAccess('roles', 'edit'), AdminController.createRole);
router.post('/getRoles', jwt.verifyAdminJwtToken, AdminController.getRoles);
router.post('/updateRole', jwt.verifyAdminJwtTokenWithAccess('roles', 'edit'), AdminController.updateRole);

//Manage Admins
router.post('/createSuperAdmin', jwt.verifyAdminJwtToken, AdminController.createSuperAdmin);
router.post('/createAdmin', jwt.verifyAdminJwtTokenWithAccess('admin-list', 'edit'), AdminController.createAdmin);
router.post('/getAdminsList', jwt.verifyAdminJwtTokenWithAccess('admin-list', 'view'), AdminController.getAdminsList);
router.post('/getAdminsCount', jwt.verifyAdminJwtToken, AdminController.getUsersCount);
router.post('/updateAdmin', jwt.verifyAdminJwtTokenWithAccess('admin-list', 'edit'), AdminController.updateAdmin);
router.post('/generateAdminPassword', jwt.verifyAdminJwtTokenWithAccess('admin-list', 'edit'), AdminController.generateAdminPassword);
router.post('/updateAdminStatus', jwt.verifyAdminJwtTokenWithAccess('admin-list', 'edit'), AdminController.updateAdminStatus);
router.post('/deleteAdmin', jwt.verifyAdminJwtTokenWithAccess('admin-list', 'delete'), AdminController.deleteAdmin);

//Manage ProductTypes
router.post('/getProductTypes', jwt.verifyAdminJwtToken, AdminController.getProductTypes);
router.post('/addProductTypes', jwt.verifyAdminJwtTokenWithAccess('product-types', 'edit'), AdminController.createProductTypes);
router.post('/updateProductTypes', jwt.verifyAdminJwtTokenWithAccess('product-types', 'edit'), AdminController.updateProductTypes);
router.post('/deleteProductTypes', jwt.verifyAdminJwtTokenWithAccess('product-types', 'delete'), AdminController.deleteProductTypes);

//Manage Categories
router.post('/getCategories', jwt.verifyAdminJwtToken, AdminController.getCategories);
router.post('/addCategories', jwt.verifyAdminJwtTokenWithAccess('categories', 'edit'), uploadImages.fields([{name: 'category_image', maxCount: 1}]), AdminController.createCategories);
router.post('/updateCategories', jwt.verifyAdminJwtTokenWithAccess('categories', 'edit'), uploadImages.fields([{name: 'category_image', maxCount: 1}]), AdminController.updateCategories);
router.post('/deleteCategories', jwt.verifyAdminJwtTokenWithAccess('categories', 'delete'), AdminController.deleteCategories);

//Manage Products
router.post('/getProducts', jwt.verifyAdminJwtToken, AdminController.getProducts);
router.post('/addProducts', jwt.verifyAdminJwtTokenWithAccess('products', 'edit'), uploadImages.fields([{name: 'product_image', maxCount: 1}]), AdminController.createProducts);
router.post('/updateProducts', jwt.verifyAdminJwtTokenWithAccess('products', 'edit'), uploadImages.fields([{name: 'product_image', maxCount: 1}]), AdminController.updateProducts);
router.post('/updateProductStatus', jwt.verifyAdminJwtTokenWithAccess('products', 'edit'), AdminController.updateProductStatus);
router.post('/deleteProducts', jwt.verifyAdminJwtTokenWithAccess('products', 'delete'), AdminController.deleteProducts);

//Manage Branches
router.post('/getBranches', jwt.verifyAdminJwtToken, AdminController.getBranches);
router.post('/getBranchesCount', jwt.verifyAdminJwtToken, AdminController.getBranchesCount);
router.post('/addBranch', jwt.verifyAdminJwtTokenWithAccess('branches', 'edit'), AdminController.addBranch);
router.post('/updateBranch', jwt.verifyAdminJwtTokenWithAccess('branches', 'edit'), AdminController.updateBranch);
router.post('/updateBranchStatus', jwt.verifyAdminJwtTokenWithAccess('branches', 'edit'), AdminController.updateBranchStatus);
router.post('/deleteBranch', jwt.verifyAdminJwtTokenWithAccess('branches', 'delete'), AdminController.deleteBranch);

//Manage TimeSlots
router.post('/getTimeSlots', jwt.verifyAdminJwtToken, AdminController.getTimeSlots);
router.post('/addTimeSlots', jwt.verifyAdminJwtTokenWithAccess('time-slots', 'edit'), AdminController.createTimeSlots);
router.post('/updateTimeSlots', jwt.verifyAdminJwtTokenWithAccess('time-slots', 'edit'), AdminController.updateTimeSlots);
router.post('/deleteTimeSlots', jwt.verifyAdminJwtTokenWithAccess('time-slots', 'delete'), AdminController.deleteTimeSlots);

//Manage Testimonials
router.post('/getTestimonials', jwt.verifyAdminJwtToken, AdminController.getTestimonials);
router.post('/addTestimonial', jwt.verifyAdminJwtTokenWithAccess('testimonials', 'edit'), AdminController.addTestimonials);
router.post('/updateTestimonial', jwt.verifyAdminJwtTokenWithAccess('testimonials', 'edit'), AdminController.updateTestimonials);
router.post('/updateTestimonialStatus', jwt.verifyAdminJwtTokenWithAccess('testimonials', 'edit'), AdminController.updateTestimonialStatus);
router.post('/deleteTestimonial', jwt.verifyAdminJwtTokenWithAccess('testimonials', 'delete'), AdminController.deleteTestimonials);

//Manage Orders
router.post('/getOrders', jwt.verifyAdminJwtTokenWithAccess('orders', 'view'), OrdersController.getOrdersList);
router.post('/updateOrdersStatus', jwt.verifyAdminJwtTokenWithAccess('orders', 'edit'), OrdersController.updateOrdersStatus);


module.exports = router;