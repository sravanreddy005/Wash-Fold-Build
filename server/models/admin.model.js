const sequelize = require('../database/db-config');
const Sequelize = require('sequelize');

const AdminModels = {};

/*********************** Role types schema defining *************************/
AdminModels.RoleTypes = sequelize.define('role_types', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: Sequelize.STRING,
    unique: true
  }
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'role_types',
    indexes: [
      {
        fields: ['type']
      }
    ]
  }
);
/*********************** End of role types schema defining *************************/

/*********************** Roles schema defining *************************/
AdminModels.Roles = sequelize.define('roles', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  role_name: {
    type: Sequelize.STRING,
    unique: true
  },
  role_type: {
    type: Sequelize.STRING
  },
  access_modules: {
    type: Sequelize.JSON,
  }
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'roles',
    indexes: [
      {
        fields: ['role_name']
      }
    ]
  }
);

/*********************** End of admin roles schema defining *************************/

/*********************** DB scema for modules *************************/
AdminModels.Modules = sequelize.define('modules', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  module_name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  module_value: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
},
{
  underscored: true,
  freezeTableName: true,
  tableName: 'modules'
}
);
/*********************** End of modules schema defining *************************/

/*********************** Branches schema defining *************************/
AdminModels.Branches = sequelize.define('branches', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
  },
  mobile_number: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.TEXT
  },
  pincode: {
    type: Sequelize.STRING,
  },  
  google_map_link: {
    type: Sequelize.TEXT
  },
  active: {
    type: Sequelize.BOOLEAN,
    default: 1
  },
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'branches',
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['email']
      },
      {
        fields: ['mobile_number']
      },
      {
        fields: ['pincode']
      },
      {
        fields: ['active']
      }
    ]
  }
);
/*********************** End of branches schema defining *************************/

/*********************** DB schema for admins *************************/
AdminModels.Admin = sequelize.define('admin', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  role_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  branch_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  mobile_number: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  address: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  hash: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
  active: {
    type: Sequelize.BOOLEAN,
    default: 1
  },
},
{
  underscored: true,
  freezeTableName: true,
  tableName: 'admin',
  indexes: [
    {
      fields: ['role_id']
    },
    {
      fields: ['salt']
    },
    {
      fields: ['hash']
    }
  ]
}
);

AdminModels.Admin.belongsTo(AdminModels.Roles, {foreignKey: 'role_id', targetKey: 'id'});
AdminModels.Admin.belongsTo(AdminModels.Branches, {foreignKey: 'branch_id', targetKey: 'id'});

/*********************** End of admins schema defining *************************/

/*********************** Product types schema defining *************************/
AdminModels.ProductTypes = sequelize.define('product_types', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  product_type: {
    type: Sequelize.STRING,
    unique: true
  }
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'product_types'
  }
);
/*********************** End of product types schema defining *************************/

/*********************** Categories schema defining *************************/
AdminModels.Categories = sequelize.define('categories', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  category_name: {
    type: Sequelize.STRING,
    unique: true
  },
  category_image: {
    type: Sequelize.STRING,
  }
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'categories'
  }
);
/*********************** End of product types schema defining *************************/

/*********************** Products schema defining *************************/
AdminModels.Products = sequelize.define('products', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  product_type_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  product_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  product_price: {
    type: Sequelize.STRING,
  },
  product_image: {
    type: Sequelize.TEXT,
  },
  active: {
    type: Sequelize.BOOLEAN,
    default: true
  }
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'products',
    indexes: [
      {
        fields: ['product_type_id']
      },
      {
        fields: ['category_id']
      },
      {
        fields: ['product_name']
      },
      {
        fields: ['product_price']
      },
      {
        fields: ['active']
      },
      {
        fields: ['product_type_id', 'category_id', 'product_name'],
        unique: true,
      }
    ]
  }
);

AdminModels.Products.belongsTo(AdminModels.ProductTypes, {foreignKey: 'product_type_id', targetKey: 'id'});
AdminModels.Products.belongsTo(AdminModels.Categories, {foreignKey: 'category_id', targetKey: 'id'});
/*********************** End of products schema defining *************************/

/*********************** Time slots schema defining *************************/
AdminModels.TimeSlots = sequelize.define('time_slots', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: Sequelize.STRING,
  },
  from_time: {
    type: Sequelize.STRING,
  },
  to_time: {
    type: Sequelize.STRING,
  }
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'time_slots',
    indexes: [
      {
        fields: ['type']
      },
      {
        fields: ['from_time']
      },
      {
        fields: ['to_time']
      },
      {
        fields: ['type', 'from_time', 'to_time'],
        unique: true,
      }
    ]
  }
);
/*********************** End of time slots schema defining *************************/

/*********************** Testimonials schema defining *************************/
AdminModels.Testimonials = sequelize.define('testimonials', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rating: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  active: {
    type: Sequelize.BOOLEAN,
    default: true
  }
},
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'testimonials',
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['active']
      }
    ]
  }
);
/*********************** End of testimonials schema defining *************************/

module.exports = AdminModels