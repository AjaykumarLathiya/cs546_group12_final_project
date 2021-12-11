const express = require('express');
const UserService = require('../services/user.service');
const AppointmentService = require('../services/appointment.service');
const session = require('express-session')
const { ObjectId } = require('mongodb');
const ReviewService = require('../services/review.service');

const router = express.Router();

router.get("/", async (req, res) => {
    let lstBarbers = await UserService.getApprovedBarbers()
    let noOfBarber = lstBarbers.length
    res.render('./pages/customer/home', { userType: "CUSTOMER", lstBarbers: lstBarbers, noOfBarber: noOfBarber, objUser: req.session.objUser });
})

router.get("/barber", async (req, res) => {
    let lstBarbers = await UserService.getApprovedBarbers()
    res.render('./pages/customer/home', { userType: "CUSTOMER", lstBarbers: lstBarbers, objUser: req.session.objUser });
})

router.get("/profile", async (req, res) => {
    let lstCustomer = await UserService.getUsers()
    res.render('./pages/customer/profile', { lstCustomer, userType: "CUSTOMER", objUser: req.session.objUser });
})

router.get("/appointment", async (req, res) => {
    let lstAppointment = await AppointmentService.getAppointmentListForCustomer(req.session.objUser._id)
    let noOfAppointment = lstAppointment.length
    res.render('./pages/customer/appointment', { lstAppointment, noOfAppointment: noOfAppointment, userType: "CUSTOMER", objUser: req.session.objUser });
})


router.post("/cancelAppointment/:id", async (req, res) => {
    try {
        let result = await AppointmentService.editAppointment(req.params.id, req.body)

        res.sendSuccess("Appointment cancel successfully")
    }
    catch (ex) {
        console.log(ex)
        res.sendError(ex, ex.message)
    }
})

router.post("/bookAppointment", async (req, res) => {
    try {
        req.body.barberId = ObjectId(req.body.barberId)
        req.body.customerId = ObjectId(req.body.customerId)
        let result = await AppointmentService.addAppointment(req.body)
        res.sendSuccess("Appointment Book successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

router.post("/giveReview", async (req, res) => {
    try {
        req.body.barberId = ObjectId(req.body.barberId)
        req.body.customerId = ObjectId(req.body.customerId)

        let resultReview = await ReviewService.addReview(req.body)

        let objAverageReview = await ReviewService.getAverageReviewById(req.body.barberId)
        let averageReview = 0
        if (objAverageReview)
            averageReview = objAverageReview.TotalReview / objAverageReview.noOfReview
        let resultUser = await UserService.editUser(req.body.barberId, { averageReview: averageReview })
        res.sendSuccess("Review successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})


// get review list by id
router.get("/getReviewById/:barberId", async (req, res) => {
    let lstReview = await ReviewService.getReviewListById(req.params.barberId)
    res.sendSuccess({ lstReview: lstReview, userType: "ADMIN", user: req.session });
})



module.exports = router;