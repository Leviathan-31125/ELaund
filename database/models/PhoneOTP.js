import { DataTypes } from "sequelize";
import DB from "../database.js";

const PhoneOTP = DB.define(
    "phoneOTP", {
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        OTP: {
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

export default PhoneOTP;