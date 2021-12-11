const express = require('express');
const UserService = require('../services/user.service');
const router = express.Router();


const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/", async (req, res) => {
    res.render('./pages/login/login', { layout: 'guest', objUser: req.session.objUser });
})

router.get("/aboutUs", async (req, res) => {
    res.render('./pages/login/aboutUs', { layout: 'guest', objUser: req.session.objUser });
})

router.post("/", async (req, res) => {
    try {

        let objUser = await UserService.getUserByEmail(req.body.userEmail)
        if (!objUser) {
            throw new Error("User not found")
        }
        const match = await bcrypt.compare(req.body.password, objUser.password);
        if (!match) {
            throw new Error("Wrong Password")
        }

        if (objUser.status === "PENDING") {
            throw new Error("Request Pending")
        }
        if (objUser.status === "REJECTED") {
            throw new Error("Your request rejected please contact admin")
        }

        req.session.objUser = { ...objUser, _id: objUser._id.toString() };

        res.sendSuccess({ type: objUser.type }, "Login successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

router.get("/registrationBarber", async (req, res) => {
    res.render('./pages/login/registrationBarber', { layout: 'guest' });
})

router.post("/registration/barber", async (req, res) => {
    try {
        let objUser = await UserService.getUserByEmail(req.body.userEmail)

        const hash = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hash
        let result = await UserService.addUser(req.body)

        if (objUser)
            throw Error('Email Already Exist')

        res.sendSuccess("Barber is add successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

router.get("/registrationCustomer", async (req, res) => {
    res.render('./pages/login/registrationCustomer', { layout: 'guest' });
})


router.post("/registration/customer", async (req, res) => {
    try {
        let objUser = await UserService.getUserByEmail(req.body.userEmail)

        const hash = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hash
        let result = await UserService.addUser(req.body)

        if (objUser)
            throw Error('Email Already Exist')

        res.sendSuccess("Barber is add successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => { });
    res.redirect('/login');
});

module.exports = router;