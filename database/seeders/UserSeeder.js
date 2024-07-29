import bcrypt from 'bcrypt';
import Users from '../models/User.js';

const data = [
    {
        email: 'alfikiyar@gmail.com',
        password: 'Ath1234',
        role: 'Admin'
    },
    {
        email: 'haidar@gmail.com',
        password: 'Ath1234',
        role: 'Member'
    },
    {
        email: 'tirta@gmail.com',
        password: 'Ath1234',
        role: 'SuperAdmin'
    },
    {
        email: 'alhadar@gmail.com',
        password: 'Ath1234',
        role: 'SuperAdmin'
    }
]

export const Seed_User = async () => {
    data.map( async (newUser) => {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newUser.password, salt);

        await Users.create({
            email: newUser.email,
            password: hashPassword,
            role: newUser.role
        })
    })
}