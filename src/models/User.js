const { Model, DataTypes } = require('sequelize');
class User extends Model{
    static init(sequelize){
        super.init({
            email:DataTypes.STRING,
            plano:DataTypes.STRING,
            senha:DataTypes.STRING,
            pagamento:DataTypes.STRING,
        },
        {
            sequelize,
            tableName: 'usuario',
        
          }
        )
    }
}

module.exports = User;