/**
 * One-time migration script — fixes carousel image paths in MongoDB.
 *
 * Old format: "/uploads/carousel/filename.ext"  (leading slash)
 * New format: "uploads/carousel/filename.ext"   (no leading slash)
 *
 * Run once with:  node scripts/fix-carousel-paths.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Carousel = require("../src/models/carouselModel");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in .env");
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const all = await Carousel.find({ image: { $regex: "^/" } });
  console.log(`Found ${all.length} carousel records with leading-slash image paths`);

  let fixed = 0;
  for (const doc of all) {
    const newPath = doc.image.replace(/^\/+/, ""); // strip leading slashes
    await Carousel.updateOne({ _id: doc._id }, { $set: { image: newPath } });
    console.log(`  Fixed: "${doc.image}" → "${newPath}"`);
    fixed++;
  }

  console.log(`\nDone — fixed ${fixed} records`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
