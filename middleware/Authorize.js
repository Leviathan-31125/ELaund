import jwt from "jsonwebtoken";
import Users from "../database/models/User.js";
import Profiles from "../database/models/Profile.js";

export const Authorize = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(" ")[1];
        const tokenPayload = jwt.verify(token, 'secret-key');
        
        req.user = await Users.findByPk(tokenPayload.id, {
            include: [{model: Profiles, attributes: ['address', 'name', 'phone'], as: "profile"}],
            attributes: ['id', 'uuid' ,'email', 'role']
        });
        next();
    } catch (err) {
        res.status(400).json({ message: "Unauthorized: you aren't log on"});
    }
}