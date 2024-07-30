import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB from "./database/database.js";
import UserRoute from "./routers/UserRouter.js";
import ProfileRoute from "./routers/ProfileRouter.js";
dotenv.config();

const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('Welcome to BackEnd Elaund');
});
app.use('/api', UserRoute);
app.use('/api/profile', ProfileRoute);

app.listen(port, async () => {
    try {
        await DB.authenticate();  
        console.log('Connection has been established successfully.');
        console.log(`Server running at http://127.0.0.1:${port}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})