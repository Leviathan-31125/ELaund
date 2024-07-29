import Users from "../database/models/User"

export const updateProfile = async (req, res) => {
    const { phone, address, name } = req.body;
    const user = Users.findByPk(req.user.id);
}