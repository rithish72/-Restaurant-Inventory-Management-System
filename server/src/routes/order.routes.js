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
router.post("/add-orders", verifyJWT, addOrders);
router.patch("/update-orders/:id", verifyJWT, updateOrders);
router.delete("/delete-orders/:id", verifyJWT, deleteOrder);

export default router;
