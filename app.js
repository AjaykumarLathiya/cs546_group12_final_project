const express = require('express');
const path = require('path');
const os = require('os');



const port = 3000;
const handlebars = require('express-handlebars')
const app = express(); 

const commonMW = require('./middleware/commonMW');
const userRoute = require('./routes/user.route') 
const loginRoute = require('./routes/login.route')
const adminRoute = require('./routes/admin.route') 
const customerRoute = require('./routes/customer.route')
const barberRoute = require('./routes/barber.route')

const bodyParser = require('body-parser');
const session = require('express-session');
const store = new session.MemoryStore();
const { connectMongo } = require('./config/mongoConnection')

const cookieParser = require("cookie-parser");
const authMW = require('./middleware/authMW');
const UserService = require('./services/user.service');

const router = express.Router();

require('./services/hbsHelpers')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userEmail = "admin@gmail.com"
const password = "admin"

async function main() {
    try {
        await connectMongo()

        console.log("Mongodb is connected")

        // Handlebars
        app.set('view engine', 'handlebars')

        const handlebarEngine = handlebars.create({
            layoutsDir: `${__dirname}/views/layouts`,
            extname: 'handlebars',
            defaultLayout: 'index',
            partialsDir: `${__dirname}/views/partials`,
        })

        app.engine('handlebars', handlebarEngine.engine)
        app.use(express.static('public'))
        app.use(session({
            secret: 'secret',
            saveUninitialized: true,
            cookie: { maxAge: 1000 * 60 * 60 * 24 },
            resave: false,
        }))


        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        //serving public file
        app.use(express.static(path.join(__dirname, "public")));
        app.use(cookieParser());


        app.use(bodyParser.json({ limit: '200mb', extended: true }));
        app.use(commonMW)
        app.use(authMW)

        app.use("/login", loginRoute)
        app.use("/admin", adminRoute)
        app.use("/customer", customerRoute)
        app.use("/barber", barberRoute)

        app.get('/', function (req, res) {
            res.render('./pages/login/home', { layout: 'guest', objUser: req.session.objUser });
        })

        app.listen(port, async () => {
            console.log(`Your server is running on http://localhost:${port}`)
            let objUser = await UserService.getUserByEmail(userEmail)
            if (objUser)
                return
            const hash = await bcrypt.hash(password, saltRounds);

            await UserService.addUser({
                userEmail: userEmail,
                password: hash,
                type: "ADMIN"
            })
        })

    } catch (e) {
        console.log("Error occurred while starting app", e)
    }
}

main().catch(console.error)