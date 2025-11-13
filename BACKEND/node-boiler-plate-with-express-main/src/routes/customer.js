const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');

router.post('/', customerController.upload.single('profilePicture'), customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;


//app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);