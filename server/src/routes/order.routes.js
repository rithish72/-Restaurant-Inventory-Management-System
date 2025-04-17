import express from "express";
import {
    getAllOrders,
    addOrders,
    updateOrders,
    deleteOrder,
    getCurrentOrder,
} from "../controllers/orders.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.get("/get-all-orders", verifyJWT, getAllOrders);
router.get("/get-order/:id", verifyJWT, getCurrentOrder);
router.post("/add-order", verifyJWT, addOrders);
router.patch("/update-order/:id", verifyJWT, updateOrders);
router.delete("/delete-order/:id", verifyJWT, deleteOrder);

export default router;
