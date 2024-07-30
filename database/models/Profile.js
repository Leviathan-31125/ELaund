import { DataTypes } from "sequelize";
import DB from "../database.js";
import Users from "./User.js";

const Profiles = DB.define(
    "profile", {
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull:false,
            validate: {
                len: [5, 100],
                notEmpty: true
            }
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneVerif: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    { 
        paranoid: true,
        freezeTableName: true,
    }
);

Users.hasOne(Profiles);
Profiles.belongsTo(Users, {foreignKey: 'userId'});

export default Profiles;