const Setting = require("../models/saletextModel");

exports.createSpecialSaletext = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || !value) {
      return res.status(400).json({ message: "Key and value are required" });
    }

    const newSetting = new Setting({ key, value });
    await newSetting.save();
    res.status(201).json(newSetting);
  } catch (err) {
    console.error("Create Special Sale Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//GET banner
exports.getBanner = async (req, res) => {
  try {
    const doc = await Setting.findOne({ key: "specialSaleBanner" });
    return res.status(200).json({ banner: doc?.value || "" });
  } catch (err) {
    console.error("GET /banner error:", err);
    return res.status(500).json({ error: "Failed to fetch banner" });
  }
};

//UPDATE banner
exports.updateBanner = async (req, res) => {
  try {
    const { banner } = req.body;

  // Fix typo in error message
    if (typeof banner !== "string") {
      return res.status(400).json({ error: "Banner must be a string" });
    }

    const doc = await Setting.findOneAndUpdate(
      { key: "specialSaleBanner" },  
      { value: banner },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ banner: doc.value });
  } catch (err) {
    console.error("PUT /banner error:", err);
    return res.status(500).json({ error: "Failed to update banner" });
  }                      
};
