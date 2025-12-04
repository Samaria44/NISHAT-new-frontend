const Setting = require("../models/saletextModel");

exports.createSpecialSaletext = async (req, res) => {
  try {
    const { key, value} = req.body;
    

    if (!value) {
      return res.status(400).json({ message: "Name is required" });
    }

    const createSpecialSaletext = new this.createSpecialSaletext({
        key,
        value,
    });

    await createSpecialSaletext.save();
    res.status(201).json(createSpecialSaletext);
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

    if (typeof banner !== "string") {
      return res.status(400).json({ error: "Bannear must be a string" });
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
