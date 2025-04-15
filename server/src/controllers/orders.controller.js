import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Orders } from '../models/orders.models.js';
import { Supplier } from '../models/supplier.models.js';
import { Inventory } from '../models/inventory.models.js';

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Orders.find();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                orders, 
                "All orders fetched successfully"
            )
    );
});

// Add new order 
const addOrders = asyncHandler(async (req, res) => {
    const { orderNumber, items, supplier, status, deliveryDate, notes } = req.body;

    if (!orderNumber || !Array.isArray(items) || !items.length || !supplier || !status || !deliveryDate) {
        throw new ApiError(400, "All required fields must be filled properly.");
    }

    // Check for duplicate order number
    const existingOrder = await Orders.findOne({ orderNumber });
    if (existingOrder) {
        throw new ApiError(409, "Order with this number already exists.");
    }

    // Find supplier by name
    const supplierDoc = await Supplier.findOne({ name: supplier });
    if (!supplierDoc) {
        throw new ApiError(404, `Supplier "${supplier}" not found.`);
    }

    // Replace item names with ObjectIds, now using itemName field in the Inventory model
    const populatedItems = await Promise.all(items.map(async (itemObj) => {
        if (!itemObj.item) {
            throw new ApiError(400, 'Item name is missing in the request.');
        }

        const inventoryItem = await Inventory.findOne({ 
            itemName: { $regex: new RegExp('^' + itemObj.item + '$', 'i') }
        });
        
        if (!inventoryItem) {
            throw new ApiError(404, `Inventory item "${itemObj.item}" not found.`);
        }

        return {
            item: inventoryItem._id,
            quantity: itemObj.quantity
        };
    }));

    const newOrder = await Orders.create({
        orderNumber,
        items: populatedItems,
        supplier: supplierDoc._id,
        status,
        deliveryDate: new Date(deliveryDate), 
        notes
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                newOrder, 
                "Order successfully created."
            )
        );
});


// Update order by ID
const updateOrders = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { orderNumber, items, supplier, status, deliveryDate, notes } = req.body;

    if (!orderNumber || !Array.isArray(items) || !items.length || !supplier || !status || !deliveryDate) {
        throw new ApiError(400, "All required fields must be filled properly.");
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
        id,
        {
            orderNumber,
            items,
            supplier,
            status,
            deliveryDate,
            notes
        },
        { 
            new: true 
        }
    );

    if (!updatedOrder) {
        throw new ApiError(404, "Order not found.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                updatedOrder, 
                "Order updated successfully."
            )
    );
});

// Delete order by ID
const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedOrder = await Orders.findByIdAndDelete(id);

    if (!deletedOrder) {
        throw new ApiError(404, "Order not found.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                deletedOrder, 
                "Order deleted successfully."
            )
    );
});

export {
    getAllOrders,
    addOrders,
    updateOrders,
    deleteOrder
};
