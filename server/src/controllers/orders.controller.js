import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Orders } from "../models/orders.models.js";
import { Supplier } from "../models/supplier.models.js";
import { Inventory } from "../models/inventory.models.js";
import mongoose from "mongoose";

// Helper to find Supplier
const getSupplierDoc = async (supplierName) => {
    const supplier = await Supplier.findOne({ name: supplierName });
    if (!supplier)
        throw new ApiError(404, `Supplier "${supplierName}" not found.`);
    return supplier;
};

// Helper to populate item references
const populateItems = async (items) => {
    return Promise.all(
        items.map(async ({ item, quantity }) => {
            if (!item)
                throw new ApiError(400, "Each item must include a name.");
            const inventoryItem = await Inventory.findOne({
                itemName: { $regex: new RegExp(`^${item}$`, "i") },
            });
            if (!inventoryItem)
                throw new ApiError(404, `Item "${item}" not found.`);
            return { item: inventoryItem._id, quantity };
        })
    );
};

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Orders.find()
        .populate("supplier", "name contactPerson email")
        .populate("items.item", "name unit price")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// Get specific order
const getCurrentOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "A valid Order ID is required");
    }

    const existingOrder = await Orders.findById(id)
        .populate("supplier", "name")
        .populate("items.item", "itemName");

    if (!existingOrder) throw new ApiError(404, "Order not found");

    return res
        .status(200)
        .json(
            new ApiResponse(200, existingOrder, "Order retrieved successfully")
        );
});

// Create new order
const addOrders = asyncHandler(async (req, res) => {
    const { orderNumber, items, supplier, status, deliveryDate, notes } =
        req.body;

    if (
        !orderNumber ||
        !Array.isArray(items) ||
        !supplier ||
        !status ||
        !deliveryDate
    ) {
        throw new ApiError(400, "All required fields must be provided.");
    }

    if (await Orders.findOne({ orderNumber })) {
        throw new ApiError(
            409,
            `Order number "${orderNumber}" already exists.`
        );
    }

    const supplierDoc = await getSupplierDoc(supplier);
    const populatedItems = await populateItems(items);

    const newOrder = await Orders.create({
        orderNumber,
        items: populatedItems,
        supplier: supplierDoc._id,
        status,
        deliveryDate: new Date(deliveryDate),
        notes,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newOrder, "Order created successfully"));
});

// Update existing order
const updateOrders = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { orderNumber, items, supplier, status, deliveryDate, notes } =
        req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ApiError(400, "Invalid Order ID");

    const supplierDoc = await getSupplierDoc(supplier);
    const populatedItems = await populateItems(items);

    const updatedOrder = await Orders.findByIdAndUpdate(
        id,
        {
            orderNumber,
            items: populatedItems,
            supplier: supplierDoc._id,
            status,
            deliveryDate: new Date(deliveryDate),
            notes,
        },
        { new: true }
    );

    if (!updatedOrder) throw new ApiError(404, "Order not found");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, "Order updated successfully"));
});

// Delete order
const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ApiError(400, "Invalid Order ID");

    const deletedOrder = await Orders.findByIdAndDelete(id);
    if (!deletedOrder) throw new ApiError(404, "Order not found");

    return res
        .status(200)
        .json(new ApiResponse(200, deletedOrder, "Order deleted successfully"));
});

export { getAllOrders, addOrders, updateOrders, deleteOrder, getCurrentOrder };
