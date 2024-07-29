import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendingMail = async({from, to, subject, text}) => {
    try {
        const mailOptions = { from, to, subject, text };
        const Transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASS
            }
        });

        return await Transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(err);
    }
}