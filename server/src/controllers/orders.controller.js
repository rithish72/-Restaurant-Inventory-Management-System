import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Orders } from "../models/orders.models.js";
import { Supplier } from "../models/supplier.models.js";
import { Inventory } from "../models/inventory.models.js";
import mongoose from "mongoose";

// Helper: Fetch supplier document
const getSupplierDoc = async (name) => {
    const supplier = await Supplier.findOne({ name });
    if (!supplier) throw new ApiError(404, `Supplier "${name}" not found.`);
    return supplier;
};

// Helper: Populate item references from names
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

// Helper: Format order response
const formatOrder = (order) => ({
    _id: order._id,
    orderNumber: order.orderNumber,
    items: order.items.map(({ item, quantity, _id }) => ({
        _id,
        quantity,
        item: {
            _id: item?._id,
            unit: item?.unit,
        },
    })),
    supplier: {
        _id: order.supplier?._id,
        name: order.supplier?.name,
        contactPerson: order.supplier?.contactPerson,
        email: order.supplier?.email,
    },
    status: order.status,
    deliveryDate: order.deliveryDate,
    notes: order.notes,
    orderDate: order.orderDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    __v: order.__v,
});

// GET all orders
const getAllOrders = asyncHandler(async (_req, res) => {
    const orders = await Orders.find()
        .populate("supplier", "name contactPerson email")
        .populate("items.item", "itemName unit")
        .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        items: order.items.map(({ item, quantity, _id }) => ({
            _id,
            quantity,
            item: {
                itemName: item?.itemName,  // return itemName instead of _id
                unit: item?.unit,
            },
        })),
        supplier: {
            _id: order.supplier?._id,
            name: order.supplier?.name,
            contactPerson: order.supplier?.contactPerson,
            email: order.supplier?.email,
        },
        status: order.status,
        deliveryDate: order.deliveryDate,
        notes: order.notes,
        orderDate: order.orderDate,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        __v: order.__v,
    }));

    return res.status(200).json(new ApiResponse(200, formattedOrders, "Orders fetched"));
});


// GET single order
const getCurrentOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Order ID");
    }

    const order = await Orders.findById(id)
        .populate("supplier", "name contactPerson email")
        .populate("items.item", "unit");

    if (!order) throw new ApiError(404, "Order not found");

    return res
        .status(200)
        .json(new ApiResponse(200, formatOrder(order), "Order fetched"));
});

// POST create order
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
        notes: notes?.trim() || "",
    });

    const populatedOrder = await Orders.findById(newOrder._id)
        .populate("supplier", "name contactPerson email")
        .populate("items.item", "unit");

    return res
        .status(201)
        .json(
            new ApiResponse(201, formatOrder(populatedOrder), "Order created")
        );
});

// PUT update order
const updateOrders = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { orderNumber, items, supplier, status, deliveryDate, notes } =
        req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Order ID");
    }

    if (
        !orderNumber ||
        !Array.isArray(items) ||
        !supplier ||
        !status ||
        !deliveryDate
    ) {
        throw new ApiError(400, "All required fields must be provided.");
    }

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
            notes: notes?.trim() || "",
        },
        { new: true }
    )
        .populate("supplier", "name contactPerson email")
        .populate("items.item", "unit");

    if (!updatedOrder) throw new ApiError(404, "Order not found");

    return res
        .status(200)
        .json(new ApiResponse(200, formatOrder(updatedOrder), "Order updated"));
});

// DELETE order
const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Order ID");
    }

    const deleted = await Orders.findByIdAndDelete(id);
    if (!deleted) throw new ApiError(404, "Order not found");

    return res.status(200).json(new ApiResponse(200, deleted, "Order deleted"));
});

export { getAllOrders, getCurrentOrder, addOrders, updateOrders, deleteOrder };
