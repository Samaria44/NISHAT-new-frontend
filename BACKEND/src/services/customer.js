const Customer = require('../models/Customer');

const createCustomer = async (customerData) => {
    return await Customer.create(customerData);
};

const getCustomers = async () => {
    return await Customer.find();
};

const updateCustomer = async (id, customerData) => {
    return await Customer.findByIdAndUpdate(id, customerData, { new: true });
};

const deleteCustomer = async (id) => {
    return await Customer.findByIdAndDelete(id);
};

const getCustomerById  = async (id) => {
    return await Customer.findById(id);
};

module.exports = {
    createCustomer,
    getCustomers,
    updateCustomer,
    deleteCustomer,
    getCustomerById 
};
