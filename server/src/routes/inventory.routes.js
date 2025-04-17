import express from "express";
import {
    getAllInventory,
    getCurrentItem,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} from "../controllers/inventory.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.get("/get-all-items", verifyJWT, getAllInventory);
router.get("/get-inventory-item/:id", verifyJWT, getCurrentItem);
router.post("/add-inventory-item", verifyJWT, addInventoryItem);
router.patch("/update-inventory-item/:id", verifyJWT, updateInventoryItem);
router.delete("/delete-inventory-item/:id", verifyJWT, deleteInventoryItem);

export default router;
