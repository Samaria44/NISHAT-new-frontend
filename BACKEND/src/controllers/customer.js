const customerService = require("../services/customer");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "../uploads/customer-images");

// Ensure upload directory exists at startup
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const createCustomer = async (req, res) => {
  try {
    const { name, username, email } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    const customer = await customerService.createCustomer({
      name,
      username,
      email,
      profilePicture,
    });

    res.status(201).json({
      ...customer._doc,
      imageURL: customer.profilePicture
        ? `${req.protocol}://${req.get("host")}/uploads/customer-images/${customer.profilePicture}`
        : null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await customerService.getCustomers();

    const customersWithImageUrls = customers.map((customer) => ({
      ...customer.toJSON(),
      profilePicture: customer.profilePicture
        ? `${req.protocol}://${req.get("host")}/uploads/customer-images/${customer.profilePicture}`
        : null,
    }));

    res.json(customersWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the old record BEFORE updating so we can delete the old image
    const oldCustomer = await customerService.getCustomerById(id);
    if (!oldCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }

    const updatedCustomer = await customerService.updateCustomer(id, updateData);

    // Delete old profile picture if a new one was uploaded
    if (req.file && oldCustomer.profilePicture) {
      const oldFilePath = path.join(UPLOAD_DIR, oldCustomer.profilePicture);
      fs.unlink(oldFilePath, (err) => {
        if (err) console.error("Failed to delete old profile picture:", err.message);
      });
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
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const profilePicture = customer.profilePicture;
    await customerService.deleteCustomer(id);

    if (profilePicture) {
      const filePath = path.join(UPLOAD_DIR, profilePicture);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete profile picture:", err.message);
      });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upload,
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};
