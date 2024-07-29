import { DataTypes } from "sequelize";
import DB from "../database.js";

const TokenVerif = DB.define(
    "tokenverif", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        token: {
            type: DataTypes.TEXT,
            allowNull:false,
            validate: {
                notEmpty: true
            }
        },
    },
    { 
        freezeTableName: true,
    }
)

export default TokenVerif;