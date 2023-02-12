const Sequelize = require('sequelize');
const winston = require('../helpers/winston');
const { AdminModels } = require('../database');
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

const {  
    addRecordToDB,
    addBulkRecordsToDB,
    getRecordsFromDB,
    getRecordsWithJoinFromDB,
    getOneRecordFromDB,
    updateRecordInDB, 
    deleteRecordInDB,
    deleteAllRecordInDB,
    getOneRecordWithJoinFromDB,
    getRecordsCount,
    getRecordsWithJoinLimitFromDB
} = require('../services/AdminService');


/**************************** ADMIN ACCESS/STATUS ***************************/
/**
 * check admin modules access 
 */
module.exports.checkAdminAccess = async (roleID, moduleVal, type) => {
    try {
        const rolesResp = await getOneRecordFromDB('Roles', {id: roleID});
        if(rolesResp && rolesResp.access_modules){
            let accessModules = Array.isArray(rolesResp.access_modules) ? rolesResp.access_modules : JSON.parse(rolesResp.access_modules);
            let moduleData = accessModules.filter(module =>{
                if (type === 'edit') {
                    return (module.module_val === moduleVal && module.edit === true);
                }else if (type === 'delete') {
                    return (module.module_val === moduleVal && module.delete === true);
                }else if (type === 'view') {
                    return (module.module_val === moduleVal && module.view === true);
                }else{
                    return false;
                }
            });
            return moduleData && moduleData.length > 0 ? true : false;
        }else{
            return false;
        }       
    }catch (err) {
        return false;
    }
}

/**
 * check admin account status 
 */
module.exports.checkAdminStatus = async (adminID) => {
    try {
        const adminResp = await getOneRecordFromDB('Admin', {id: adminID});
        if(adminResp && adminResp.active === true){
            return true;
        }else{
            return false;
        }       
    }catch (err) {
        return false;
    }
}

/**************************** END ADMIN ACCESS/STATUS ***************************/

/**************************** MODULES ***************************/
/**
 * fetching the admin modules list 
 */
module.exports.getModules = async (req, res, next) => {
    try {
        const modulesResp = await getRecordsFromDB('Modules');
        return res.status(200).json({responseCode: 1,message: "success",modules: modulesResp});        
    }catch (err) {
        return next(err);
    }
}

/**
 * creating the modules 
 */
module.exports.createModule = async (req, res, next) => {
    try {
        if(req.body && req.body.module_name && alnumRegx.test(req.body.module_name)){
            let reqData = {
                module_name: req.body.module_name,
                module_value: await stringToSlug(req.body.module_name)
            }
            const resp = await addRecordToDB(reqData, 'Modules');
            if(resp){
                res.status(200).json({responseCode: 1, message: "Details successfully added"});
            }else{
                res.status(200).json({responseCode: 0, message: "Details adding has failed"});
            }             
        }        
    }catch (err) {
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "Module already exists with this name"});
        }else{
            return next(err);
        }
    }
}
/**************************** END MODULES ***************************/

/**************************** ADMIN ROLES ***************************/
/**
 * fetching the role types 
 */
 module.exports.getRoleTypes = async (req, res, next) => {
    try {
        const resp = await getRecordsFromDB('RoleTypes');
        res.status(200).json({responseCode: 1,message: "success",roleTypes: resp});        
    }catch (err) {
        return next(err);
    }
}

/**
 * creating the roles 
 */
module.exports.createRole = async (req, res, next) => {
    try {
        const reqBody = req.body;
        let roleTypes = ['Super-Admin', 'Admin', 'Branch', 'Agent'];
        if(
            reqBody &&
            reqBody.role_name && 
            validateData('alnum', reqBody.role_name) && 
            reqBody.role_type &&
            roleTypes.indexOf(reqBody.role_type) > -1 &&
            reqBody.modules
        ){
            let addData = {
                role_name: req.body.role_name,
                role_type: req.body.role_type,
                access_modules: req.body.modules,
            }
            const resp = await addRecordToDB(addData, 'Roles');
            if(resp){
                res.status(200).json({responseCode: 1, message: "Details successfully added"});
            }else{
                res.status(200).json({responseCode: 0, message: "Details adding has failed"});
            }
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message: "Bad request"});
        }      
    }catch (err) {
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "Role already exists with this name"});
        }else{
            return next(err);
        }
    }
}

/**
 * fetching the admin roles 
 */
module.exports.getRoles = async (req, res, next) => {
    try {
        const rolesResp = await getRecordsFromDB('Roles');
        res.status(200).json({responseCode: 1,message: "success",roles: rolesResp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getRoles method': err.message });
        return next(err);
    }
}

/**
 * updating the admin roles details
 */
module.exports.updateRole = async (req, res, next) => {
    try {
        const reqBody = req.body;
        let roleTypes = ['Super-Admin', 'Admin', 'Branch', 'Agent'];
        if(
            reqBody &&
            reqBody.role_name && 
            validateData('alnum', reqBody.role_name) && 
            reqBody.role_type &&
            roleTypes.indexOf(reqBody.role_type) > -1 &&
            reqBody.modules
        ){
            const roleID = req.body.role_id;
            let updateData = {
                role_name: req.body.role_name,
                role_type: req.body.role_type,
                access_modules: req.body.modules,
            }
            let updateResp = await updateRecordInDB('Roles', updateData, {id: roleID});
            if(updateResp){
                return res.status(200).json({responseCode: 1,message: "Details updated successfully"});
            }else{
                return res.status(200).json({responseCode: 0,message: "Details updating has failed"});
            }
        }        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateRole method': err.message });
        return next(err);
    }
}

/**************************** END ADMIN ROLES ***************************/


/**************************** MANAGE ADMINS ***************************/

/**
 * creating the super admin 
 */
 module.exports.createSuperAdmin = async (req, res, next) => {
    try {
        const passwordHashSalt = await generateHashSaltUsingString(req.body.password);
        const email = (req.body.email).toLowerCase();
        let data = {
            role_id: req.body.role,
            first_name: req.body.first_name ? req.body.first_name : '',
            last_name: req.body.last_name ? req.body.last_name : '',
            email: email,
            address: req.body.address ? req.body.address : '',
            salt: passwordHashSalt.salt,
            hash: passwordHashSalt.hash,
            active: 1
        };
        const adminResp = await addRecordToDB(data, 'admin');
        if(adminResp){            
            res.status(200).json({responseCode: 1, message: "Super Admin created successfully"});   
        }else{
            res.status(200).json({responseCode: 0, message: "Super Admin creating has failed"}); 
        }     
    }catch (err) {
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "Admin already exists with this email"});
        }else{
            return next(err);
        }
    }
}

/**
 * creating the users 
 */
module.exports.createAdmin = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
        reqData && 
        reqData.role && validateData('num', reqData.role) &&
        reqData.email && validateData('email', reqData.email) && 
        reqData.mobile_number &&
        reqData.first_name && validateData('alnum', reqData.first_name)
        ){
            const passwordObj = await generatePasswordHashSalt();
            const email = (req.body.email).toLowerCase();
            let data = {
                role_id: reqData.role,
                branch_id: reqData.branch ? reqData.branch : null,
                first_name: reqData.first_name,
                last_name: reqData.last_name ? reqData.last_name : '',
                email: email,
                mobile_number: reqData.mobile_number,
                address: reqData.address ? reqData.address : '',
                salt: passwordObj.salt,
                hash: passwordObj.hash,
                active: 1
            }
            const resp = await addRecordToDB(data, 'Admin');
            if(resp){
                const replaceData = {
                    first_name: req.body.first_name,
                    username : email,
                    password : passwordObj.password,
                    login_url : process.env.APP_URL + '/auth/login'
                }
                const sendMailResp = await sendMail(email, replaceData, 'sendUserNamePassword', 'pepiPost');
                console.log('User details', {email: email, password: passwordObj.password});
                res.status(200).json({responseCode: 1, message: "User created successfully"});   
            }else{
                res.status(200).json({responseCode: 0, message: "User creating has failed"}); 
            } 
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }    
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in createAdmin method': err.message });
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "User already exists with this email"});
        }else{            
            return next(err);
        }
    }
}

/**
 * fetching the admins list 
 */
module.exports.getAdminsList = async (req, res, next) => {
    try {
        let whereData = {};
        let includeWhereData = {};
        if(req.tokenData && req.tokenData.role_type && req.tokenData.role_type !== 'Super-Admin'){
            includeWhereData = {role_type: {[Op.not]: ['Super-Admin']}};
        }
        let attributes = ['id','role_id','first_name','last_name','email','mobile_number','address','active','created_at','updated_at'];
        let includeData = [ 
            { 
                model: AdminModels.Roles, 
                attributes: ["role_name", "role_type"], 
                where: includeWhereData,
                required: true, 
            },
            { 
                model: AdminModels.Branches, 
                attributes: ["name"], 
                required: false, 
            } 
        ];
        const adminResp = await getRecordsWithJoinFromDB('Admin', whereData, includeData, attributes);
        res.status(200).json({responseCode: 1, message: "success", adminsList: adminResp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getAdminsList method': err.message });
        return next(err);
    }
}

/**
 * fetching the admins list count
 */
module.exports.getUsersCount = async (req, res, next) => {
    try {  
        let whereData = {};  
        const totalCount = await getRecordsCount('Admin', whereData);
        whereData.active = true;
        const activeCount = await getRecordsCount('Admin', whereData);
        res.status(200).json({responseCode: 1, message: "success", count: {totalUsers: totalCount, activeUsers: activeCount}});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getUsersCount method': err.message });
        return next(err);
    }
}

/**
 * updating the admin details
 */
module.exports.updateAdmin = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
        reqData &&
        reqData.role && validateData('num', reqData.role) &&
        reqData.admin_id && validateData('num', reqData.admin_id) &&
        reqData.email && validateData('email', reqData.email) && 
        reqData.mobile_number && 
        reqData.first_name && validateData('alnum', reqData.first_name)
        ){
            const adminID = req.body.admin_id;
            let updateData = {
                role_id: reqData.role,
                branch_id: reqData.branch ? reqData.branch : null,
                first_name: reqData.first_name,
                last_name: reqData.last_name ? reqData.last_name : '',
                email: (reqData.email).toLowerCase(),
                mobile_number: reqData.mobile_number,
                address: reqData.address ? reqData.address : ''
            }            
            const resp = await updateRecordInDB('Admin', updateData, {id: adminID});
            if(resp){
                res.status(200).json({responseCode: 1, message: "Details updated successfully"}); 
            }else{
                res.status(200).json({responseCode: 0, message: "Details updating has failed"}); 
            }
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }       
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateAdmin method': err.message });
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "User already exists with this email"});
        }else{
            return next(err);
        }
    }
}

/**
 * updating the status of admin
 */
module.exports.updateAdminStatus = async (req, res, next) => {
    try {        
        if(req.body.id && (req.body.current_status || req.body.current_status === false)){
            const status = (req.body.current_status) ? false : true;
            let updateResp = await updateRecordInDB('Admin', {active: status}, {id: req.body.id});
            if(updateResp){
                return res.status(200).json({responseCode: 1, message: "success"});
            }else{
                return res.status(200).json({responseCode: 0, message: "Status updating has failed"});
            }
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Invalid request"});
        }               
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateAdminStatus method': err.message });
        return next(err);
    }
}

/**
 * generating user password
 */
 module.exports.generateAdminPassword = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(reqData && reqData.id){
            let adminData = await getOneRecordFromDB('Admin', {id: reqData.id});
            if(adminData && adminData.mobile_number){
                const passwordObj = await generatePasswordHashSalt();
                let data = {
                    salt: passwordObj.salt,
                    hash: passwordObj.hash,
                }
                const resp = await updateRecordInDB('Admin', data, {id: reqData.id});
                if(resp){    
                    let template = {
                        name: 'account_credentials',
                        components: [{
                            type: 'body',
                            parameters: [
                                {
                                    "type": "text",
                                    "text": adminData.first_name
                                },
                                {
                                    "type": "text",
                                    "text": (adminData.email).toLowerCase()
                                },
                                {
                                    "type": "text",
                                    "text": passwordObj.password
                                },
                                {
                                    "type": "text",
                                    "text": process.env.APP_URL + '/auth/login'
                                }
                            ]
                        }],
                        language: {code: 'en_US'}
                    };
                    let message = await sendWhatsappMessage(`91${adminData.mobile_number}`, template);
    
                    res.status(200).json({responseCode: 1, message: "Password generated successfully"});   
                }else{
                    res.status(200).json({responseCode: 0, message: "Password generating has failed"}); 
                }
            }else{
                res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
            }             
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }    
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in generateUserPassword method': err.message });
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "User already exists with this email"});
        }else{            
            return next(err);
        }
    }
}

/**
 * delete the admin 
 */
module.exports.deleteAdmin = async (req, res, next) => {
    try {
        if(req.body && req.body.id){
            const deleteResp = await deleteRecordInDB('Admin', {id: req.body.id});
            if(deleteResp){
                res.status(200).json({responseCode: 1, message: "success"});
            }else{
                res.status(200).json({responseCode: 0, message: "failure"});
            }
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in deleteAdmin method': err.message });
        return next(err);
    }
}

/* 
Get the admin profile details
@getAdminProfile()
*/
module.exports.getAdminProfile = async (req, res, next) => {
    try {
        if(req.tokenData.id){
            const adminID = req.tokenData.id;
            const adminResp = await getOneRecordFromDB('Admin', {id: adminID});
            res.status(200).json({responseCode: 1, data: adminResp});
        }else{
            res.status(200).json('');
        }                
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getAdminProfile method': err.message });
        return next(err);
    }
}

/**
 * updating the admin email
 */
module.exports.updateEmail = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
            reqData && 
            reqData.email &&
            validateData('email', reqData.email) &&
            reqData.new_email &&
            validateData('email', reqData.new_email) &&
            reqData.email !== reqData.new_email &&
            reqData.password
        ){
            const adminID = req.tokenData.id;
            const newEmail = (reqData.new_email).toLowerCase();
            const adminValues = await validateUserLogin(reqData.password, {email: reqData.email});
            if(adminValues){
                let updateData = {email: newEmail};
                const adminResp = await updateRecordInDB('Admin', updateData, {id: adminID});
                if(adminResp){
                    let adminData = {
                        id: adminValues.id,
                        email: newEmail,
                        first_name: adminValues.first_name,
                        last_name: adminValues.last_name,
                        role_id: adminValues.role_id,
                        role_type: adminValues.role.role_type,
                        isAdmin: true,
                        access_modules: adminValues.role.access_modules
                    }
                    let tokens = await getAccessAndRefreshTokens(adminData, adminValues.id);
                    if(tokens && tokens.accessToken && tokens.refreshToken){  
                        return res.status(200).json({
                            responseCode: 1,
                            message: "success",
                            accessToken : tokens.accessToken,
                            refreshToken : tokens.refreshToken
                        });                                            
                    }else{
                        return res.status(200).json({
                            responseCode: 1,
                            message: "success",
                            accessToken : '',
                            refreshToken : ''
                        });
                    }
                }else{
                    return res.status(422).json({responseCode: 0, errorCode: 'iw1004', message : "iw1004 :: Something went wrong ! Please try again"});
                }
            }else{
                return res.status(200).json({responseCode: 0, errorCode: 'iw1003', message: "Invalid password"});
            }   
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message: "Bad Request"});
        }
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateEmail method': err.message });
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "User already exists with this email"});
        }else{
            return next(err);
        }
    }
}

/**
 * updating the admin profile details
 */
module.exports.updateProfile = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
        reqData &&
        reqData.mobile_number && 
        reqData.first_name && validateData('alnum', reqData.first_name)
        ){
            const adminID = req.tokenData.id;
            let updateData = {...req.body, modified_at: new Date()};
            const adminResp = await updateRecordInDB('Admin', updateData, {id: adminID}, false);
            res.status(200).json({responseCode: 1, message: "Details updated successfully"});  
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message: "Bad Request"});
        }      
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateProfile method': err.message });
        return next(err);
    }
}

/* 
Updating the admin password
@updatePassword()
 */
module.exports.updatePassword = async (req, res, next) => {
    try {
        var errRespMsg = 'Something went wrong ! Please try again.' 
        const reqBody = req.body;
        if(
            reqBody &&
            reqBody.old_password &&
            reqBody.new_password &&
            reqBody.confirm_new_password
        ){    
            const oldPassword = reqBody.old_password;
            const newPassword = reqBody.new_password;
            const confirmNewPassword = reqBody.confirm_new_password;
            if(oldPassword && passwordRegx.test(oldPassword)){
                if(newPassword && passwordRegx.test(newPassword)){
                    if(oldPassword !== newPassword){
                        if(newPassword === confirmNewPassword){
                            const adminID = req.tokenData.id;
                            const adminValues = await validateUserLogin(oldPassword, {id: adminID});
                            if(adminValues){
                                let passwordHashSalt = await generateHashSaltUsingString(newPassword);
                                let updateData = {
                                    salt: passwordHashSalt.salt,
                                    hash: passwordHashSalt.hash
                                }
                                const updateResp = await updateRecordInDB('Admin', updateData, {id: adminID});
                                if(updateResp){
                                    return res.status(200).json({ responseCode: 1, message: 'Password updated successfully' }); 
                                }else{
                                    return res.status(200).json({ responseCode: 0, message: 'Password updating has failed' }); 
                                }                                
                            }else{
                                return res.status(200).json({ responseCode: 0, message: 'Invalid old password.'});
                            }                            
                        }else{
                            errRespMsg = 'New password and confirm password must be match.'
                        }
                    }else{
                        errRespMsg = 'Old and new passwords must be different.'
                    }
                }else{
                    errRespMsg = 'Invalid new password.'
                }
            }else{
                errRespMsg = 'Invalid old password.'
            }
        }
        return res.status(200).json({responseCode: 0, message:errRespMsg});
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updatePassword method': err.message });
        return next(err);
    }
}

/**************************** END MANAGE ADMINS ***************************/

/**************************** PRODUCT TYPES ***************************/
/**
 * creating the product types 
 */
module.exports.createProductTypes = async (req, res, next) => {
    try {
        const reqBody = req.body;
        console.log('reqBody', reqBody);
        if(
            reqBody &&
            reqBody.product_type && validateData('alnum', reqBody.product_type)
        ){
            let addData = {
                product_type: req.body.product_type
            }
            const resp = await addRecordToDB(addData, 'ProductTypes');
            if(resp){
                res.status(200).json({responseCode: 1, message: "Details successfully added"});
            }else{
                res.status(200).json({responseCode: 0, message: "Details adding has failed"});
            }
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message: "Bad request"});
        }      
    }catch (err) {
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "Product types already exists with this name"});
        }else{
            return next(err);
        }
    }
}

/**
 * fetching the product types
 */
module.exports.getProductTypes = async (req, res, next) => {
    try {
        const resp = await getRecordsFromDB('ProductTypes', true, null, [['id', 'ASC']]);
        res.status(200).json({responseCode: 1, message: "success", data: resp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getProductTypes method': err.message });
        return next(err);
    }
}

/**
 * updating the product types
 */
module.exports.updateProductTypes = async (req, res, next) => {
    try {
        const reqBody = req.body;
        if(
            reqBody &&
            reqBody.id &&
            reqBody.product_type && validateData('alnum', reqBody.product_type)
        ){
            const id = req.body.id;
            let updateData = {
                product_type: req.body.product_type
            }
            let updateResp = await updateRecordInDB('ProductTypes', updateData, {id: id});
            if(updateResp){
                return res.status(200).json({responseCode: 1,message: "Details updated successfully"});
            }else{
                return res.status(200).json({responseCode: 0,message: "Details updating has failed"});
            }
        }        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateProductTypes method': err.message });
        return next(err);
    }
}

/**
 * delete the product types 
 */
module.exports.deleteProductTypes = async (req, res, next) => {
    try {
        if(req.body && req.body.id){
            const deleteResp = await deleteRecordInDB('ProductTypes', {id: req.body.id});
            if(deleteResp){
                let deleteProductsResp = await deleteRecordInDB('Products', {product_type_id: req.body.id});
                res.status(200).json({responseCode: 1, message: "success"});
            }else{
                res.status(200).json({responseCode: 0, message: "failure"});
            }
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in deleteProductTypes method': err.message });
        return next(err);
    }
}

/**************************** END PRODUCT TYPES ***************************/

/**************************** PRODUCT CATEGORIES ***************************/
/**
 * creating the categories 
 */
module.exports.createCategories = async (req, res, next) => {
    try {
        const reqBody = req.body;
        if(
            reqBody &&
            reqBody.category_name && validateData('alnumSpecial', reqBody.category_name)
        ){
            let addData = {
                category_name: req.body.category_name
            }
            if(req.files && req.files['category_image'] && req.files['category_image'][0]['filename']){
                addData.category_image = req.files['category_image'][0]['filename'];
            }else{
                addData.category_image = 'default-category.png';
            }
            const resp = await addRecordToDB(addData, 'Categories');
            if(resp){
                res.status(200).json({responseCode: 1, message: "Details successfully added"});
            }else{
                res.status(200).json({responseCode: 0, message: "Details adding has failed"});
            }
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message: "Bad request"});
        }      
    }catch (err) {
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "Category already exists with this name"});
        }else{
            return next(err);
        }
    }
}

/**
 * fetching the categories
 */
module.exports.getCategories = async (req, res, next) => {
    try {
        const resp = await getRecordsFromDB('Categories');
        res.status(200).json({responseCode: 1, message: "success", data: resp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getCategories method': err.message });
        return next(err);
    }
}

/**
 * updating the categories
 */
module.exports.updateCategories = async (req, res, next) => {
    try {
        const reqBody = req.body;
        if(
            reqBody &&
            reqBody.id &&
            reqBody.category_name && validateData('alnumSpecial', reqBody.category_name)
        ){
            const id = req.body.id;
            let updateData = {
                category_name: req.body.category_name
            }
            if(req.files && req.files['category_image'] && req.files['category_image'][0]['filename']){
                updateData.category_image = req.files['category_image'][0]['filename'];
            }
            let updateResp = await updateRecordInDB('Categories', updateData, {id: id});
            if(updateResp){
                return res.status(200).json({responseCode: 1,message: "Details updated successfully"});
            }else{
                return res.status(200).json({responseCode: 0,message: "Details updating has failed"});
            }
        }        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateCategories method': err.message });
        return next(err);
    }
}

/**
 * delete the categories
 */
module.exports.deleteCategories = async (req, res, next) => {
    try {
        if(req.body && req.body.id){
            const deleteResp = await deleteRecordInDB('Categories', {id: req.body.id});
            if(deleteResp){
                let deleteProductsResp = await deleteRecordInDB('Products', {category_id: req.body.id});
                res.status(200).json({responseCode: 1, message: "success"});
            }else{
                res.status(200).json({responseCode: 0, message: "failure"});
            }
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in deleteCategories method': err.message });
        return next(err);
    }
}

/**************************** END CATEGORIES ***************************/

/**************************** PRODUCTS ***************************/
/**
 * creating the products 
 */
module.exports.createProducts = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
            reqData && 
            reqData.product_type && validateData('num', reqData.product_type) &&
            reqData.category && validateData('num', reqData.category) &&
            reqData.product_name && validateData('alnumSpecial', reqData.product_name) &&
            reqData.product_price && validateData('float', reqData.product_price) 
        ){
            let data = {
                product_type_id: reqData.product_type,
                category_id: reqData.category,
                product_name: reqData.product_name,
                product_price: reqData.product_price,
                active: 1
            }
            
            if(req.files && req.files['product_image'] && req.files['product_image'][0]['filename']){
                let filename = req.files['product_image'][0]['filename'];
                sharp(`./server/uploads/${req.body.image_path}/${filename}`).resize(450,450).png({quality : 100}).toFile(`./server/uploads/${req.body.image_path}/resized-${filename}`);
                // fs.unlinkSync(`./server/uploads/${req.body.image_path}/${filename}`);
                data.product_image = 'resized-' + req.files['product_image'][0]['filename'];
            }else{
                data.product_image = 'default-product.png';
            }
            const resp = await addRecordToDB(data, 'Products');
            if(resp){
                res.status(200).json({responseCode: 1, message: "Product added successfully"});   
            }else{
                res.status(200).json({responseCode: 0, message: "Product adding has failed"}); 
            } 
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }    
    }catch (err) {
        if (err.name == 'SequelizeUniqueConstraintError'){
            return res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "Product already exists with this name"});
        }else{
            winston.info({ 'AdminController:: Exception occured in createProducts method': err.message });
            return next(err);
        }
        
    }
}

/**
 * fetching the products list 
 */
module.exports.getProducts = async (req, res, next) => {
    try {
        let joinData = [ 
            { 
                model: AdminModels.ProductTypes, 
                attributes: ["product_type"],
                required: true, 
            },
            { 
                model: AdminModels.Categories, 
                attributes: ["category_name"],
                required: true, 
            } 
        ];
        const resp = await getRecordsWithJoinFromDB('Products', '', joinData);
        res.status(200).json({responseCode: 1, message: "success", products: resp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getProducts method': err.message });
        return next(err);
    }
}

/**
 * fetching the products list 
 */
module.exports.getLatestProducts = async (req, res, next) => {
    try {
        let joinData = [ 
            { 
                model: AdminModels.ProductTypes, 
                attributes: ["product_type"],
                required: true, 
            },
            { 
                model: AdminModels.Categories, 
                attributes: ["category_name"],
                required: true, 
            } 
        ];
        const resp = await getRecordsWithJoinLimitFromDB('Products', '', joinData, 10);
        res.status(200).json({responseCode: 1, message: "success", products: resp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getProducts method': err.message });
        return next(err);
    }
}

/**
 * fetching the products count
 */
 module.exports.getProductsCount = async (req, res, next) => {
    try {        
        const count = await getRecordsCount('Products');
        res.status(200).json({responseCode: 1, message: "success", count: count});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getProductsCount method': err.message });
        return next(err);
    }
}

/**
 * updating the products
 */
 module.exports.updateProducts = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
            reqData && 
            reqData.id && 
            reqData.product_type && validateData('num', reqData.product_type) &&
            reqData.category && validateData('num', reqData.category) &&
            reqData.product_name && validateData('alnumSpecial', reqData.product_name) &&
            reqData.product_price && validateData('float', reqData.product_price) 
        ){
            let data = {
                product_type_id: reqData.product_type,
                category_id: reqData.category,
                product_name: reqData.product_name,
                product_price: reqData.product_price,
                active: 1
            }
            if(req.files && req.files['product_image'] && req.files['product_image'][0]['filename']){
                data.product_image = req.files['product_image'][0]['filename'];
            }
            const resp = await updateRecordInDB('Products', data, {id: reqData.id});
            if(resp){
                res.status(200).json({responseCode: 1, message: "Details updated successfully"});   
            }else{
                res.status(200).json({responseCode: 0, message: "Details updating has failed"}); 
            } 
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }    
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateProducts method': err.message });
        return next(err);
    }
}

/**
 * updating the status of product
 */
 module.exports.updateProductStatus = async (req, res, next) => {
    try {        
        if(req.body.id && (req.body.current_status || req.body.current_status === false)){
            const status = (req.body.current_status) ? false : true;
            let updateResp = await updateRecordInDB('Products', {active: status}, {id: req.body.id});
            if(updateResp){
                return res.status(200).json({responseCode: 1, message: "success"});
            }else{
                return res.status(200).json({responseCode: 0, message: "Status updating has failed"});
            }
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Invalid request"});
        }               
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateProductStatus method': err.message });
        return next(err);
    }
}

/**
 * delete the products 
 */
module.exports.deleteProducts = async (req, res, next) => {
    try {
        if(req.body && req.body.id){
            const deleteResp = await deleteRecordInDB('Products', {id: req.body.id});
            if(deleteResp){
                res.status(200).json({responseCode: 1, message: "success"});
            }else{
                res.status(200).json({responseCode: 0, message: "failure"});
            }
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in deleteProducts method': err.message });
        return next(err);
    }
}
/**************************** END PRODUCTS ***************************/

/**************************** MANAGE BRANCHES ***************************/
/**
 * creating the branch 
 */
module.exports.addBranch = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
            reqData && 
            reqData.branch_name && validateData('alnumSpecial', reqData.branch_name) &&
            reqData.branch_email && validateData('email', reqData.branch_email) &&
            reqData.branch_mobile_number &&
            reqData.address && validateData('address', reqData.address) && 
            reqData.pincode 
        ){
            let data = {
                name: reqData.branch_name,
                email: reqData.branch_email,
                mobile_number: reqData.branch_mobile_number,
                address: reqData.address,
                pincode: reqData.pincode,
                google_map_link: reqData.google_map_link ? reqData.google_map_link : null,
                active: 1
            }
            const resp = await addRecordToDB(data, 'Branches');
            if(resp){
                res.status(200).json({responseCode: 1, message: "Branch added successfully"});   
            }else{
                res.status(200).json({responseCode: 0, message: "Branch adding has failed"}); 
            } 
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }    
    }catch (err) {
        if (err.name == 'SequelizeUniqueConstraintError'){
            return res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "Branch already exists with this name"});
        }else{
            winston.info({ 'AdminController:: Exception occured in addBranch method': err.message });
            return next(err);
        }
        
    }
}

/**
 * fetching the branches list 
 */
module.exports.getBranches = async (req, res, next) => {
    try {
        const resp = await getRecordsFromDB('Branches');
        res.status(200).json({responseCode: 1, message: "success", list: resp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getBranches method': err.message });
        return next(err);
    }
}

/**
 * fetching the branches count
 */
 module.exports.getBranchesCount = async (req, res, next) => {
    try {        
        const count = await getRecordsCount('Branches');
        res.status(200).json({responseCode: 1, message: "success", count: count});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getBranchesCount method': err.message });
        return next(err);
    }
}

/**
 * updating the branch info
 */
 module.exports.updateBranch = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
            reqData && 
            reqData.id && 
            reqData.branch_name && validateData('alnumSpecial', reqData.branch_name) &&
            reqData.branch_email && validateData('email', reqData.branch_email) &&
            reqData.branch_mobile_number &&
            reqData.address && validateData('address', reqData.address) &&
            reqData.pincode
        ){
            let data = {
                name: reqData.branch_name,
                email: reqData.branch_email,
                mobile_number: reqData.branch_mobile_number,
                address: reqData.address,
                pincode: reqData.pincode,
                google_map_link: reqData.google_map_link ? reqData.google_map_link : null,
            }
            const resp = await updateRecordInDB('Branches', data, {id: reqData.id});
            if(resp){
                res.status(200).json({responseCode: 1, message: "Details updated successfully"});   
            }else{
                res.status(200).json({responseCode: 0, message: "Details updating has failed"}); 
            } 
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }    
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateBranch method': err.message });
        return next(err);
    }
}

/**
 * updating the status of branch
 */
 module.exports.updateBranchStatus = async (req, res, next) => {
    try {        
        if(req.body.id && (req.body.current_status || req.body.current_status === false)){
            const status = (req.body.current_status) ? false : true;
            let updateResp = await updateRecordInDB('Branches', {active: status}, {id: req.body.id});
            if(updateResp){
                return res.status(200).json({responseCode: 1, message: "success"});
            }else{
                return res.status(200).json({responseCode: 0, message: "Status updating has failed"});
            }
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Invalid request"});
        }               
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateBranchStatus method': err.message });
        return next(err);
    }
}

/**
 * delete the branch 
 */
module.exports.deleteBranch = async (req, res, next) => {
    try {
        if(req.body && req.body.id){
            const deleteResp = await deleteRecordInDB('Branches', {id: req.body.id});
            if(deleteResp){
                res.status(200).json({responseCode: 1, message: "success"});
            }else{
                res.status(200).json({responseCode: 0, message: "failure"});
            }
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in deleteBranch method': err.message });
        return next(err);
    }
}
/**************************** END MANAGE BRANCHES ***************************/

/**************************** TIME SLOTS ***************************/
/**
 * creating the time slots 
 */
module.exports.createTimeSlots = async (req, res, next) => {
    try {
        const reqBody = req.body;
        console.log('reqBody', reqBody);
        if(
            reqBody &&
            reqBody.type &&
            reqBody.from_time && validateData('time', reqBody.from_time) &&
            reqBody.to_time && validateData('time', reqBody.to_time)
        ){
            let addData = {
                type: req.body.type,
                from_time: req.body.from_time,
                to_time: req.body.to_time
            }
            const resp = await addRecordToDB(addData, 'TimeSlots');
            if(resp){
                res.status(200).json({responseCode: 1, message: "Details successfully added"});
            }else{
                res.status(200).json({responseCode: 0, message: "Details adding has failed"});
            }
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message: "Bad request"});
        }      
    }catch (err) {
        if (err.name == 'SequelizeUniqueConstraintError'){
            res.status(409).json({responseCode: 0, errorCode: 'iw1005', message : "Time slot already exists with this info"});
        }else{
            return next(err);
        }
    }
}

/**
 * fetching the time slots
 */
module.exports.getTimeSlots = async (req, res, next) => {
    try {
        const resp = await getRecordsFromDB('TimeSlots', true, null, [['from_time', 'ASC']]);
        res.status(200).json({responseCode: 1, message: "success", data: resp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getTimeSlots method': err.message });
        return next(err);
    }
}

/**
 * updating the time slots
 */
module.exports.updateTimeSlots = async (req, res, next) => {
    try {
        const reqBody = req.body;
        if(
            reqBody &&
            reqBody.id &&
            reqBody.type &&
            reqBody.from_time && validateData('time', reqBody.from_time) &&
            reqBody.to_time && validateData('time', reqBody.to_time)
        ){
            let id = reqBody.id;
            let updateData = {
                type: reqBody.type,
                from_time: reqBody.from_time,
                to_time: reqBody.to_time
            }
            let updateResp = await updateRecordInDB('TimeSlots', updateData, {id: id});
            if(updateResp){
                return res.status(200).json({responseCode: 1,message: "Details updated successfully"});
            }else{
                return res.status(200).json({responseCode: 0,message: "Details updating has failed"});
            }
        }        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateTimeSlots method': err.message });
        return next(err);
    }
}

/**
 * delete the time slots
 */
module.exports.deleteTimeSlots = async (req, res, next) => {
    try {
        if(req.body && req.body.id){
            const deleteResp = await deleteRecordInDB('TimeSlots', {id: req.body.id});
            if(deleteResp){
                res.status(200).json({responseCode: 1, message: "success"});
            }else{
                res.status(200).json({responseCode: 0, message: "failure"});
            }
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in deleteTimeSlots method': err.message });
        return next(err);
    }
}

/**************************** END TIME SLOTS ***************************/

/**************************** MANAGE TESTIMONIALS ***************************/
/**
 * creating the testimonials 
 */
module.exports.addTestimonials = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
            reqData && 
            reqData.name && validateData('alnumSpecial', reqData.name) &&
            reqData.description && validateData('nonHTML', reqData.description) &&
            validateData('float', reqData.rating)
        ){
            let data = {
                name: reqData.name,
                description: reqData.description,
                rating: reqData.rating ? reqData.rating : null,
                active: 1
            }
            const resp = await addRecordToDB(data, 'Testimonials');
            if(resp){
                res.status(200).json({responseCode: 1, message: "Testimonial added successfully"});   
            }else{
                res.status(200).json({responseCode: 0, message: "Testimonial adding has failed"}); 
            } 
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }    
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in addTestimonials method': err.message });
        return next(err);        
    }
}

/**
 * fetching the testimonials list 
 */
module.exports.getTestimonials = async (req, res, next) => {
    try {
        const resp = await getRecordsFromDB('Testimonials');
        res.status(200).json({responseCode: 1, message: "success", list: resp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getTestimonials method': err.message });
        return next(err);
    }
}

/**
 * fetching the testimonials list 
 */
module.exports.getActiveTestimonials = async (req, res, next) => {
    try {
        const resp = await getRecordsFromDB('Testimonials', true, {active: true}, [['created_at', 'DESC']]);
        res.status(200).json({responseCode: 1, message: "success", list: resp});        
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in getTestimonials method': err.message });
        return next(err);
    }
}

/**
 * updating the testimonial info
 */
 module.exports.updateTestimonials = async (req, res, next) => {
    try {
        const reqData = req.body;
        if(
            reqData && 
            reqData.id && 
            reqData.name && validateData('alnumSpecial', reqData.name) &&
            reqData.description && validateData('nonHTML', reqData.description) &&
            validateData('float', reqData.rating)
        ){
            let data = {
                name: reqData.name,
                description: reqData.description,
                rating: reqData.rating ? reqData.rating : null,
            }
            const resp = await updateRecordInDB('Testimonials', data, {id: reqData.id});
            if(resp){
                res.status(200).json({responseCode: 1, message: "Details updated successfully"});   
            }else{
                res.status(200).json({responseCode: 0, message: "Details updating has failed"}); 
            } 
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }    
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateTestimonials method': err.message });
        return next(err);
    }
}

/**
 * updating the status of testimonial
 */
 module.exports.updateTestimonialStatus = async (req, res, next) => {
    try {        
        if(req.body.id && (req.body.current_status || req.body.current_status === false)){
            const status = (req.body.current_status) ? false : true;
            let updateResp = await updateRecordInDB('Testimonials', {active: status}, {id: req.body.id});
            if(updateResp){
                return res.status(200).json({responseCode: 1, message: "success"});
            }else{
                return res.status(200).json({responseCode: 0, message: "Status updating has failed"});
            }
        }else{
            return res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Invalid request"});
        }               
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in updateTestimonialStatus method': err.message });
        return next(err);
    }
}

/**
 * delete the testimonials 
 */
module.exports.deleteTestimonials = async (req, res, next) => {
    try {
        if(req.body && req.body.id){
            const deleteResp = await deleteRecordInDB('Testimonials', {id: req.body.id});
            if(deleteResp){
                res.status(200).json({responseCode: 1, message: "success"});
            }else{
                res.status(200).json({responseCode: 0, message: "failure"});
            }
        }else{
            res.status(400).json({responseCode: 0, errorCode: 'iw1003', message : "Bad Request"});
        }
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in deleteTestimonials method': err.message });
        return next(err);
    }
}
/**************************** END MANAGE TESTIMONIALS ***************************/

/**************************** DOWNLOAD FILES ***************************/
 module.exports.downLoadFiles = async (req, res, next) => {
    try {
        if(req.body.folderName && req.body.fileName){
            const file = `./server/uploads/${req.body.folderName}/${req.body.fileName}`;
            //No need for special headers
            return res.download(file); 
        }else{
            return res.status(200).json({responseCode: 0}); 
        }
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in downLoadFiles method': err.message });
        return next(err);
    }
}
module.exports.generateInvoicePDF = async (req, res, next) => {
    try {
        let shipmentData = req.body.data;
        // Read source template
        const source = await read(`./server/uploads/invoices/invoice-template.html`, 'utf-8');
        let commodityList = JSON.parse(shipmentData.commodity_list);        
        let boxesDetails = JSON.parse(shipmentData.boxes_details);
        let boxDimentions = [];
        boxesDetails.map(data => {
            boxDimentions.push(`${data.width}*${data.length}*${data.height}`);
        }); 
        let totalCommodityValue = await getSumByKey(commodityList, 'commodity_value');       
        let data = {
            ...shipmentData,
            date : await formatDate(shipmentData.date, 'dd-mm-yyyy'),
            awb_number: shipmentData.tracking_no1 ? shipmentData.tracking_no1 : '',
            box_dimentions: (boxDimentions.toString()).replace(/,/g, ', '),
            destination_country: (shipmentData.country.country_name).toUpperCase(),
            commodities: commodityList,
            total_commodities_quantity: await getSumByKey(commodityList, 'quantity'),
            total_commodities_unitprice: await getSumByKey(commodityList, 'unit_price'),
            total_commodity_value: totalCommodityValue,
            amount_in_words: await amountInwords(totalCommodityValue)
        };
        // Convert to Handlebars template and add the data
        const template = handlebars.compile(source);
        const html = template(data);

        // PDF Options
        const pdf_options = {
            format: 'A4',
            orientation: "portrait",
            border: "0",
            childProcessOptions: {
                env: {
                  OPENSSL_CONF: '/dev/null',
                },
            }
        };

        // Generate PDF and promisify the toFile function
        const p = pdf.create(html, pdf_options);
        p.toFile = promisify(p.toFile);
        let fileNameVal = shipmentData.invoice_number ? (shipmentData.invoice_number).toLowerCase() : new Date().getTime();
        // Saves the file to the File System as invoice.pdf in the current directorylet
        let fileName = 'invoice' + fileNameVal + '.pdf'
        await p.toFile(`./server/uploads/invoices/${fileName}`);
        const file = `./server/uploads/invoices/${fileName}`;
        const stream = fs.createReadStream(file);
        stream.on('end', function() {
            fs.unlinkSync(file);
        });
        return stream.pipe(res);
    }catch (err) {
        winston.info({ 'AdminController:: Exception occured in generateInvoicePDF method': err.message });
        return next(err);
    }
}
 
/**************************** DOWNLOAD FILES ***************************/