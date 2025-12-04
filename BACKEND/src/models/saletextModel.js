const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // always "specialSaleBanner"
  value: { type: String, default: "" },
  }, {timestamps: true}
);

module.exports = mongoose.model("Banner", bannerSchema);
