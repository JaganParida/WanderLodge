const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const MONGO_URL = process.env.ATLASDB_URL || process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error("No database URL provided in environment.");
  process.exit(1);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6785511723eb6bcfc840e6e9",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
