const express = require('express');
const router = express.Router();
const customerRoutes = require('./customer');
const authRoutes = require('./auth');

// Main router combining all routes
router.use('/v1/customers', customerRoutes);
router.use('/v1/auth', authRoutes);
// router.use('/', async (req, res) => { res.status(200).json({message:"welcome to customer manager"}) });

module.exports = router;
