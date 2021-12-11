const express = require('express');
const UserService = require('../services/user.service');

const router = express.Router();

router.get("/", async (req, res) => {
    let lstCustomer = await UserService.getCustomers()
    res.render('./pages/customer/customer', { lstCustomer });
})

router.get("/add", async (req, res) => {
    res.render('./pages/customer/customer-add-edit', {});
})

router.post("/add", async (req, res) => {
    try {
        let result = await UserService.addUser(req.body)
        res.sendSuccess("its good")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }

})

router.get("/edit/:id", async (req, res) => {
    let objCustomer = await UserService.getCustomer(req.params.id)
    res.render('./pages/customer/customer-add-edit', { id: req.params.id, objCustomer });
})

router.post("/edit/:id", async (req, res) => {
    try {
        let result = await UserService.editUser(req.params.id, req.body)
        res.sendSuccess("its good")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})

router.post("/delete/:id", async (req, res) => {
    try {
        let result = await UserService.deleteUser(req.params.id)
        res.sendSuccess("Customer is deleted successfully")
    }
    catch (ex) {
        res.sendError(ex, ex.message)
    }
})


module.exports = router;