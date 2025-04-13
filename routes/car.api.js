const express = require("express");
const {
  createCar,
  getCars,
  editCar,
  deleteCar,
} = require("../controllers/car.controller");
const router = express.Router();
const { z } = require("zod");

const validationRequestMiddleware =
  (schema, requestPart) => (req, res, next) => {
    const result = schema.safeParse(req[requestPart]);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues,
        message: "Validation failed",
      });
    }
    req[requestPart] = result.data;
    next();
  };
const getCarsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const createSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  release_date: z.coerce.number().int().min(1900),
  transmission_type: z.enum([
    "MANUAL",
    "AUTOMATIC",
    "AUTOMATED_MANUAL",
    "DIRECT_DRIVE",
    "UNKNOWN",
  ]),
  size: z.enum(["Compact", "Midsize", "Large"]),
  style: z.string().min(1),
  price: z.coerce.number().int().positive(),
});
const updateSchema = createSchema.partial();

const idSchema = z.object({ id: z.string().min(24) });

// CREATE
router.post("/", validationRequestMiddleware(createSchema, "body"), createCar);

// READ
router.get("/", validationRequestMiddleware(getCarsSchema, "query"), getCars);

// UPDATE
router.put(
  "/:id",
  validationRequestMiddleware(idSchema, "params"),
  validationRequestMiddleware(updateSchema, "body"),
  editCar
);

// // DELETE
router.delete(
  "/:id",
  validationRequestMiddleware(idSchema, "params"),
  deleteCar
);

module.exports = router;
