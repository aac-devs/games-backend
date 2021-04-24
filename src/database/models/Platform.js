const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Platform extends Model {
    static associate(models) {
      this.belongsToMany(models.game, { through: 'game_platform' });
    }
  }
  Platform.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'platform',
    },
  );
  return Platform;
};
