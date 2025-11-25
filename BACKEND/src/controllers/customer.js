const Customer = require('../models/Customer');
const customerService = require('../services/customer');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/customer-images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const createCustomer = async (req, res) => {
    try {
        const { name, username, email } = req.body;
        const profilePicture = req.file ? req.file.filename : null;

        const customer = await customerService.createCustomer({ name, username, email, profilePicture });

        res.status(201).json({
            ...customer._doc, imageURL: customer.profilePicture != null ? `${req.protocol}://${req.get('host')}/api/v1/uploads/customer-images/${customer.profilePicture}` : null,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCustomers = async (req, res) => {
    try {
        const customers = await customerService.getCustomers();

        const customersWithImageUrls = customers.map(customer => ({
            ...customer.toJSON(),
            profilePicture: customer.profilePicture != null ? `${req.protocol}://${req.get('host')}/api/v1/uploads/customer-images/${customer.profilePicture}` : null
        }));

        res.json(customersWithImageUrls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCustomer = await customerService.updateCustomer(id, req.body);
        console.log(updatedCustomer)

        if (req.file) {
            const oldCustomer = await customerService.getCustomerById(id);
            const oldProfilePicture = oldCustomer.profilePicture;

            if (oldProfilePicture) {
                const filePath = path.join(__dirname, `../uploads/customer-images/${oldProfilePicture}`);
                fs.unlinkSync(filePath);
            }

            updatedCustomer.profilePicture = req.file.filename;
            await updatedCustomer.save();
        }

        res.json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await customerService.getCustomerById(id);
        const profilePicture = customer.profilePicture;

        await customerService.deleteCustomer(id);

        if (profilePicture) {
            const filePath = path.join(__dirname, `../uploads/customer-images/${profilePicture}`);
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    upload,
    createCustomer,
    getCustomers,
    updateCustomer,
    deleteCustomer
};
