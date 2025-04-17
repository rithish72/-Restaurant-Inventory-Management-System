import mongoose, { Schema } from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        unit: {
            type: String,
            required: true,
            enum: ["kg", "g", "l", "ml", "pcs", "packs", "other"],
        },
        threshold: {
            type: Number,
            required: true,
            min: 0,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
