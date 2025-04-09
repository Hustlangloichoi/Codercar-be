require("dotenv").config();
const mongoose = require("mongoose");
const csv = require("csvtojson");
const Car = require("./models/Car.js");

mongoose.connect(process.env.MONGO_URI);

async function importCSV() {
  try {
    let cars = await csv().fromFile("./data.csv");
    cars = cars.map((car) => ({
      make: car["Make"],
      model: car["Model"],
      release_date: Number(car["Year"]),
      transmission_type: car["Transmission Type"],
      size: car["Vehicle Size"],
      style: car["Vehicle Style"],
      price: Number(car["MSRP"]),
      isDeleted: false,
    }));
    await Car.insertMany(cars);
    console.log("Data imported successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error importing data:", error);
    mongoose.disconnect();
  }
}

importCSV();
