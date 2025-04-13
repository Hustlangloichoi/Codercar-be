const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};
const { z } = require("zod");

//validationRequestMiddleware

carController.createCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const newCar = await Car.create(req.body);
    res.status(201).json({ data: newCar });
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  try {
    let { limit, page } = req.query;

    const skip = (page - 1) * limit;
    // YOUR CODE HERE
    const cars = await Car.find({ isDeleted: false }).limit(limit).skip(skip);
    const totalCount = await Car.countDocuments({ isDeleted: false });
    const total = Math.ceil(totalCount / limit);
    res.status(200).json({ data: { cars, total } });
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ data: updated });
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    car.isDeleted = true;
    await car.save();
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

module.exports = carController;
