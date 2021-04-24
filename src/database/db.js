const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
// let route;
// const modelRoute = (route) => {
//   return require(route);
// };

const basename = path.basename(__filename);

// Declaración del objeto DB
const db = {};

const sequelize = new Sequelize(`${process.env.DATABASE_URL}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialect: 'postgres',
  define: {
    timestamps: false,
    underscored: true,
  },
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line global-require
    const model = require(path.join(path.join(__dirname, '/models', file)))(
      sequelize,
      Sequelize.DataTypes,
    );
    // Cada modelo que hay en el directorio lo vinculamos a nuestro objeto DB
    db[model.name] = model;
  });

// Realizar las asociaciones de los modelos
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
