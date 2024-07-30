import DB from "./database.js";
import PhoneOTP from "./models/PhoneOTP.js";
import Profiles from "./models/Profile.js";
import TokenVerif from "./models/TokenVerif.js";
import Users from "./models/User.js";

(async() => {
    await DB.drop();
    await Users.sync({force: true});
    await Profiles.sync({force: true});
    await TokenVerif.sync({force: true});
    await PhoneOTP.sync({force: true});
})();