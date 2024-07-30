import axios from "axios";
import DB from "../database/database.js";
import Users from "../database/models/User.js"
import PhoneOTP from "../database/models/PhoneOTP.js";
import Profiles from "../database/models/Profile.js";

export const updateProfile = async (req, res) => {
    const { phone, address, name } = req.body;
    const profile = await Profiles.findOne({where: { userId: req.user.id }});

    try {
        if (profile) {  
            const checkPhoneNumber = await Profiles.findOne({where: {phone: phone}});
            
            if (checkPhoneNumber) return res.status(400).json({message: "Phone number already used"});

            profile.phone = phone;
            profile.address = address;
            profile.name = name;
            await profile.save();

            return res.status(201).json({ message: "Profile successfully updated" });
        } else {
            return res.status(400).json({ message: "User Not Found!" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error Found! " + err });
    }
}

export const sendOTPVerification = async (req, res) => {
    const {phone} = req.user.profile;
    let transaction;

    // set value OTP of max > OTP > min
    const minOTP = 99999
    const maxOTP = 1000000

    try {
        transaction = await DB.transaction();
        const OTP = Math.floor(Math.random() * (maxOTP - minOTP) + minOTP);
        
        const insertOTP = await PhoneOTP.create({
            phone: phone,
            OTP: OTP
        });

        if (insertOTP) {
            const data = {
                target: phone,
                message: `Your OTP Code: *${OTP}*`
            }

            const option = {
                method: "post",
                url: process.env.FONTE_URL,
                headers: {
                    Authorization: process.env.TOKEN_FONTE
                },
                data: data
            }
            
            await axios.request(option).catch((err) => {throw(err)});
        }
        
        await transaction.commit();
        return res.status(200).json({message: "OTP already sent"});
    } catch (err) {
        if (transaction) {
            await transaction.rollback()
        }
        
        return res.status(500).json({ message: "Error Found! " + err });
    }
}

export const phoneVerification = async (req, res) => {
    const {OTP} = req.body;
    const {phone} = req.user.profile;

    // set expired OTP in second 
    const expiredOTP = 60 * 5;

    try {
        const checkOTP = await PhoneOTP.findOne({where: {phone: phone, OTP: OTP}});

        if (checkOTP) {
            // get time different at second 
            const timeDifferent = (new Date().getTime() - new Date(checkOTP.createdAt).getTime()) / 1000;
            await checkOTP.destroy();

            if (expiredOTP >= timeDifferent) {
                await Profiles.update(
                    { phoneVerif: true }, 
                    { where: { phone: phone }}
                );

                return res.status(201).json({message: "OTP Verified"});
            } else {
                return res.status(400).json({message: "OTP Expired! Please resend OTP"});
            }
        } else {
            return res.status(400).json({message: "OTP Invalid!"});
        }
    } catch (err) {
        return res.status(500).json({ message: "Error Found! " + err });
    }

}