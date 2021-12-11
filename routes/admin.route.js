const express = require('express');
const UserService = require('../services/user.service');

const router = express.Router();

const AppointmentService = require('../services/appointment.service');
const bcrypt = require('bcrypt');
const ReviewService = require('../services/review.service');
const saltRounds = 10;

router.post("/requestAccept/:id", async (req, res) => {
    let result = await UserService.editUser(req.params.id, req.body)
    res.sendSuccess("Status change")
})

// ------------------------------------------------------------------CUSTOMER-------------------------------------------------------------
// get customer list
router.get("/", async (req, res) => {
    let lstCustomer = await UserService.getCustomers()
    res.render('./pages/admin/customer', { lstCustomer, userType: "ADMIN", user: req.session });
})

// get customer list 
router.get("/customer", async (req, res) => {
    let lstCustomer = await UserService.getCustomers()
    res.render('./pages/admin/customer', { lstCustomer, userType: "ADMIN", user: req.session.user });
})

//Edit Customer
router.get("/customer/edit/:id", async (req, res) => {
    let objCustomer = await UserService.getUser(req.params.id)
    res.render('./pages/admin/customer-add-edit', { id: req.params.id, objCustomer: objCustomer, userType: "ADMIN" });
})

router.post("/customer/edit/:id", async (req, res) => {
    try {
        if (req.body.password) {
            const hash = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hash
        }
        let result = await UserService.editUser(req.params.id, req.body)
        res.sendSuccess("Customer is edit successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})


// Add Customer
router.get("/customer/add", async (req, res) => {
    res.render('./pages/admin/customer-add-edit', { userType: 'ADMIN' });
})

router.post("/customer/add", async (req, res) => {
    try {
        let objUser = await UserService.getUserByEmail(req.body.userEmail)
        if (objUser)
            throw Error('Email Already Exist')
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hash
        let result = await UserService.addUser(req.body)

        res.sendSuccess("Customer is add successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

// Delete Customer
router.post("/customer/delete/:id", async (req, res) => {
    try {
        let result = await UserService.deleteUser(req.params.id)
        res.sendSuccess("Customer is deleted successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

// ------------------------------------------------------------------BARBER-------------------------------------------------------------

// get Barber list 
router.get("/barber", async (req, res) => {
    let lstBarber = await UserService.getBarbers()
    res.render('./pages/admin/barber', { lstBarber: lstBarber, userType: "ADMIN" });
})

//Edit Barber
router.get("/barber/edit/:id", async (req, res) => {
    if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hash
    }
    let objBarber = await UserService.getUser(req.params.id)
    res.render('./pages/admin/barber-add-edit', { id: req.params.id, objBarber: objBarber, userType: "ADMIN" });
})

router.post("/barber/edit/:id", async (req, res) => {
    try {
        let result = await UserService.editUser(req.params.id, req.body)
        res.sendSuccess("Barber is edit successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})


// Add barber
router.get("/barber/add", async (req, res) => {
    res.render('./pages/admin/barber-add-edit', { userType: 'ADMIN' });
})

router.post("/barber/add", async (req, res) => {
    try {
        let objUser = await UserService.getUserByEmail(req.body.userEmail)
        if (objUser)
            throw Error('Given email already exist')

        const hash = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hash
        let result = await UserService.addUser(req.body)

        res.sendSuccess("Barber is add successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

// Delete barber
router.post("/barber/delete/:id", async (req, res) => {
    try {
        let result = await UserService.deleteUser(req.params.id)
        res.sendSuccess("Barber is deleted successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

// ------------------------------------------------------------------APPOINTMENT-------------------------------------------------------------

// get appointment list
router.get("/appointment", async (req, res) => {
    let lstAppointment = await AppointmentService.getAppointmentList()
    res.render('./pages/admin/appointment', { lstAppointment, userType: "ADMIN", user: req.session });
})


// ------------------------------------------------------------------REVIEW-------------------------------------------------------------

// get review list
router.get("/review", async (req, res) => {
    let lstReview = await ReviewService.getReviewList()
    res.render('./pages/admin/review', { lstReview: lstReview, userType: "ADMIN", user: req.session });
})


module.exports = router;