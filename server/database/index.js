const sequelize = require("./db-config");
const AuthModels = require('../models/auth.model');
const AdminModels = require('../models/admin.model');
const OrdersModels = require('../models/orders.model');

const synncDB = async() => {
  try {
    await sequelize.sync();
    console.log("DB connected and all models were synchronized successfully.");
  } catch (error) {
    console.log("synchronized failed.", error);
  }  
}

synncDB();

module.exports = { AdminModels, AuthModels, OrdersModels };
