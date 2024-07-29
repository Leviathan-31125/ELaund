import Users from "../database/models/User.js"
import Profiles from "../database/models/Profile.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendingMail } from "../utils/mailer.js";
import TokenVerif from "../database/models/TokenVerif.js";

export const getAllUsers = async (req, res) => {
    try {
        const data = await Users.findAll();
        return res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error Found" + err });
    }
}

export const currentUser = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({ message: 'Error Found: ' + err })
    }
}

export const register = async (req, res) => {
    const { email, password, role = "MEMBER", name } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    
    try {
        const user = await Users.create({
            email: email,
            password: hashPassword,
            role: role,
            verified: false
        });

        if (user) {
            await Profiles.create({
                name: name,
                userId: user.id
            });

            const verifToken = jwt.sign(
                { id: user.id, email: user.email },
                "account-verif",
                {expiresIn: 60 * 5} // expired in 5 minutes
            );

            await TokenVerif.create({
                email: user.email,
                token: verifToken,
            });

            sendingMail({
                from: "service@elaund.com",
                to: email,
                subject: "Account Verification Link",
                text: `Hello, ${name.split(" ")[1]} Please verify your email by clicking this link : http://localhost:3000/api/users/verify-email/${verifToken} `,
            });

            return res.status(201).json({
                message: "User successfully created",
                data: {
                    name: name,
                    email: email,
                    role: role
                }
            });
        } else {
            return res.status(400).json({message: "Fail to register!"});
        }
    } catch (err) {
        res.status(500).json({ message: "Error Found" + err });
    }
}

export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    
    try {
        const emailVerif = jwt.verify(token, "account-verif");
        if (emailVerif) {
            const user = await Users.findOne({where: {email: emailVerif.email}});
            const verifToken = await TokenVerif.findOne({ where: {email: emailVerif.email, token: token} });
            verifToken.destroy();

            if (!user.verified) {
                user.verified = true;
                await user.save();

                return res.status(201).json({message: "You're verified, let's login to enjoy your service"});
            } else {
                return res.status(200).json({message: "You have beed verified"});
            }
        } else {
            return res.status(400).json({message: "Link verification had expired!"});
        }
    } catch (err) {
        return res.status(500).json({message: `Error Found! ${err}`});
    }
}

export const sendVerifyEmail = async (req, res) => {
    const {email} = req.query;

    try {
        const user = await Users.findOne({
            where: {
                email: email, 
                verified: false
            }, 
            include: [{model: Profiles, attributes: ['name']}]
        });

        if (user) {
            const verifToken = jwt.sign(
                { id: user.id, email: user.email },
                "account-verif",
                {expiresIn: 60 * 5} // expired in 5 minutes
            );

            const checkToken = await TokenVerif.findOne({ where: {email: email} });
            if (checkToken) {
                checkToken.token = verifToken;
                await checkToken.save();
            } else {
                await TokenVerif.create({
                    email: user.email,
                    token: verifToken,
                });
            }
    
            sendingMail({
                from: "service@elaund.com",
                to: email,
                subject: "Account Verification Link",
                text: `Hello, ${user.profile.name.split(" ")[0]} Please verify your email by clicking this link : ${process.env.APP_DOMAIN}/api/users/verify-email/${verifToken} `,
            });

            res.status(200).json({message: "Verification link already sent! Please check your email."});
        } else {
            return res.status(400).json({message: "User not found!"});
        }
    } catch (err) {
        res.status(500).json({ message: "Error Found" + err });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ where: { email: email }});

        if (!user) return res.status(400).json({message: "User not found, register first!"});
        if (!user.verified) return res.status(400).json({message: "Unverified Email! Please verify your email first."});

        const match = await bcrypt.compare(password, user.password);
        
        if (!match)
            return res.status(400).json({ message: "Password incorrect!" });
        else {
            const accessToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                "secret-key",
                {expiresIn: '1d'}
            );

            const hourExpired = 6;
            const gmt = 7;
            const expiredAge = 1000 * 60 * 60 * (hourExpired + gmt);
            
            res.cookie("accessToken", accessToken, {httpOnly: true, maxAge: expiredAge});
            return res.status(201).json({
                message: "Successfully Login", 
                data: {
                    email: email, 
                    token: accessToken
                }
            });
        }
    } catch (err) {
        res.status(500).json({ message: "Error Found" + err });
    }
}

export const logout = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            res.status(400).json({message: "User not found, please register first"})

        res.cookie("accessToken", '', {httpOnly: true, maxAge: 1 });
        res.status(201).json({
            message: "Successfully Logout", 
            user
        });
    } catch (err) {
        res.status(500).json({ message: 'Error Found: ' + err })
    }
}