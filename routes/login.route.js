const express = require('express');
const UserService = require('../services/user.service');
const router = express.Router();

router.get("/", async (req, res) => {
    res.render('./pages/login/login', { layout: 'guest' });
})

router.post("/", async (req, res) => {
    try {

        let objUser = await UserService.getUserByEmail(req.body.userEmail)
        // console.log(objUser)

        if (!objUser) {
            throw new Error("User not found")
        }
        if (objUser.password !== req.body.password) {
            throw new Error("Wrong Password")
        }
        if (objUser.status === "PENDING") {
            throw new Error("Request Pending")
        }
        if (objUser.status === "REJECTED") {
            throw new Error("Your request rejected please contact admin")
        }

        req.session.objUser = objUser;

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
        console.log(objUser, "objUser")

        if (objUser)
            throw Error('Email Already Exist')

        let result = await UserService.addUser(req.body)
        res.sendSuccess("Barber is add successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

router.get("/registrationCustomer", async (req, res) => {
    res.render('./pages/login/registrationCustomer', { layout: 'guest' });
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => { });
    res.redirect('/login');
});

module.exports = router;