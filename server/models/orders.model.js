const sequelize = require('../database/db-config');
const Sequelize = require('sequelize');
const AdminModels = require('./admin.model');

const OrdersModels = {};

/*********************** CustomerInfo schema defining *************************/
OrdersModels.CustomerInfo = sequelize.define('customer_info', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,    
  },
  order_id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mobile_number: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pickup_date: {
    type: Sequelize.DATEONLY
  },
  pickup_time_slot: {
    type: Sequelize.STRING
  },
  drop_date: {
    type: Sequelize.DATEONLY
  },
  drop_time_slot: {
    type: Sequelize.STRING
  },
  pincode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address1: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address2: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  payment_type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  order_status: {
    type: Sequelize.STRING,
    allowNull: false,
    default: 'PENDING'
  },
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'customer_info',
    indexes: [
      {
        fields: ['order_id']
      },
      {
        fields: ['first_name']
      },
      {
        fields: ['last_name']
      },
      {
        fields: ['email']
      },
      {
        fields: ['mobile_number']
      },
      {
        fields: ['pickup_date']
      },
      {
        fields: ['pickup_time_slot']
      },
      {
        fields: ['drop_date']
      },
      {
        fields: ['drop_time_slot']
      },
      {
        fields: ['pincode']
      },
      {
        fields: ['city']
      },
      {
        fields: ['payment_type']
      },
      {
        fields: ['order_status']
      },
    ]
  }
);


/*********************** End of customerInfo schema defining *************************/

/*********************** Orders schema defining *************************/
OrdersModels.Orders = sequelize.define('orders', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  product_price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  total_price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'orders',
    indexes: [
      {
        fields: ['order_id']
      },
      {
        fields: ['product_id']
      },
      {
        fields: ['product_price']
      },
      {
        fields: ['quantity']
      },
    ]
  }
);

// OrdersModels.Orders.belongsTo(OrdersModels.CustomerInfo, { foreignKey: "order_id", targetKey: "order_id"});
// OrdersModels.CustomerInfo.hasOne(OrdersModels.Orders, { foreignKey: "order_id", targetKey: "order_id"});
// OrdersModels.Orders.belongsTo(AdminModels.Products, {foreignKey: 'product_id', targetKey: 'id'});
OrdersModels.CustomerInfo.hasMany(OrdersModels.Orders, { foreignKey: 'order_id' });
OrdersModels.Orders.belongsTo(OrdersModels.CustomerInfo, { foreignKey: 'order_id', targetKey:'order_id' });
OrdersModels.Orders.belongsTo(AdminModels.Products, {foreignKey: 'product_id', targetKey: 'id'});
/*********************** End of orders schema defining *************************/

// OrdersModels.CustomerInfo.belongsTo(OrdersModels.Orders, {foreignKey: 'order_id', targetKey: 'order_id'});

module.exports = OrdersModels