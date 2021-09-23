import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.RefreshToken = User.hasOne(models.RefreshToken);
      User.Roles = User.hasMany(models.Role);
    }

    static async hashPassword(password) {}

    static async createNewUser({
      email,
      password,
      roles,
      username,
      firstName,
      lastName,
      refreshToken,
    }) {}
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Not a valid email address',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        validate: {
          len: {
            args: [2, 50],
            msg: 'Username must contain between 2 and 50 characters',
          },
        },
      },
      firstName: {
        type: DataTypes.STRING(50),
        validate: {
          len: {
            args: [3, 50],
            msg: 'First name must contain between 3 and 50 characters',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING(50),
        validate: {
          len: {
            args: [3, 50],
            msg: 'Last name must contain between 3 and 50 characters',
          },
        },
      },
    },
    { sequelize, modelName: 'User' }
  );

  return User;
};
