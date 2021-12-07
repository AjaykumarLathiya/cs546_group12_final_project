const express = require('express');
const AppointmentService = require('../services/appointment.service');
const ReviewService = require('../services/review.service');
const UserService = require('../services/user.service');
const router = express.Router();

router.get("/", async (req, res) => {
    let lstAppointment = await AppointmentService.getAppointmentListForBarber(req.session.objUser._id)
    res.render('./pages/barber/appointment', { lstAppointment, userType: "BARBER" });
})

router.get("/profile", async (req, res) => {
    let lstCustomer = await UserService.getUsers()
    let lstReview = await ReviewService.getReviewListById(req.session.objUser._id)
    res.render('./pages/barber/profile', { lstReview, lstCustomer, userType: "BARBER", objUser: req.session.objUser });
})

router.get("/appointment", async (req, res) => {
    let lstAppointment = await AppointmentService.getAppointmentListForBarber(req.session.objUser._id)
    res.render('./pages/barber/appointment', { lstAppointment, userType: "BARBER" });
})

router.post("/changeAppointmentStatus/:id", async (req, res) => {
    try {
        let result = await AppointmentService.editAppointment(req.params.id, req.body)
        res.sendSuccess("Appointment cancel successfully")
    }
    catch (ex) {
        console.log(ex)
        res.sendError(ex, ex.message)
    }
})


module.exports = router;