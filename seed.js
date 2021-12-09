const { connectMongo } = require('./config/mongoConnection')
const UserService = require('./services/user.service');

require('./services/hbsHelpers')
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function main() {
    try {
        await connectMongo()

        console.log("Mongodb is connected")
        let lstBarber = [
            {
                status: "APPROVED",
                type: "BARBER",
                userFirstName: "Tracey",
                userLastName: "brb",
                experience: 2,
                averageReview: 5,
                contactNo: "9904035026",
                userEmail: "tracey@gmail.com",
                password: "123456"
            },
            {
                status: "APPROVED",
                type: "BARBER",
                userFirstName: "Dave",
                userLastName: "brb",
                experience: 2,
                averageReview: 5,
                contactNo: "9904035027",
                userEmail: "dave@gmail.com",
                password: "123456"
            },
            {
                status: "APPROVED",
                type: "BARBER",
                userFirstName: "Ramon",
                userLastName: "brb",
                experience: 2,
                averageReview: 5,
                contactNo: "9904035026",
                userEmail: "ramon@gmail.com",
                password: "123456"
            },
            {
                status: "APPROVED",
                type: "BARBER",
                userFirstName: "Loretta",
                userLastName: "brb",
                experience: 2,
                averageReview: 5,
                contactNo: "9904035027",
                userEmail: "loretta@gmail.com",
                password: "123456"
            }
        ]

        let lstCustomer = [
            {
                type: "CUSTOMER",
                userFirstName: "Alison",
                userLastName: "bfd",
                contactNo: "9904035026",
                userEmail: "alison@gmail.com",
                password: "123456"
            },
            {
                type: "CUSTOMER",
                userFirstName: "Mark",
                userLastName: "bfd",
                contactNo: "9904035026",
                userEmail: "mark@gmail.com",
                password: "123456"
            },
            {
                type: "CUSTOMER",
                userFirstName: "Perry",
                userLastName: "bfd",
                contactNo: "9904035026",
                userEmail: "perry@gmail.com",
                password: "123456"
            },
            {
                type: "CUSTOMER",
                userFirstName: "Nicole",
                userLastName: "bfd",
                contactNo: "9904035026",
                userEmail: "nicole@gmail.com",
                password: "123456"
            },
        ]
        for (let obj of lstBarber) {
            let objUser = await UserService.getUserByEmail(obj.userEmail)
            if (objUser)
                break
            const hash = await bcrypt.hash(obj.password, saltRounds);
            obj.password = hash
            await UserService.addUser(obj)
        }
        for (let obj of lstCustomer) {
            let objUser = await UserService.getUserByEmail(obj.userEmail)
            if (objUser)
                break
            const hash = await bcrypt.hash(obj.password, saltRounds);
            obj.password = hash
            await UserService.addUser(obj)
        }

    } catch (e) {
        console.log("Error occurred while starting seed", e)
    }
}

main().catch(console.error)