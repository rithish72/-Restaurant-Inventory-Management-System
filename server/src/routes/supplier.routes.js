import express from "express";
import {
    getAllSuppliers,
    getCurrentSupplier,
    addSupplier,
    updateSupplier,
    deleteSupplier,
} from "../controllers/supplier.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.get("/get-all-suppliers", verifyJWT, getAllSuppliers);
router.get("/get-supplier/:id", verifyJWT, getCurrentSupplier);
router.post("/add-supplier", verifyJWT, addSupplier);
router.patch("/update-supplier/:id", verifyJWT, updateSupplier);
router.delete("/delete-supplier/:id", verifyJWT, deleteSupplier);

export default router;
