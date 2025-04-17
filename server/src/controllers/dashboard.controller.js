import { Inventory } from "../models/inventory.models.js";
import { Orders } from "../models/orders.models.js";
import { Supplier } from "../models/supplier.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDashboardStats = asyncHandler(async (_req, res) => {
    const totalItems = await Inventory.countDocuments();

    const lowStockItems = await Inventory.find({ quantity: { $lt: 10 } })
        .select("name quantity")
        .limit(10)
        .lean();

    const recentOrders = await Orders.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("items.item", "itemName")
        .lean();

    const recentOrderSummary = recentOrders.flatMap((order) =>
        order.items.map(({ item, quantity }) => ({
            name: item?.itemName || "Unnamed Item",
            quantity,
        }))
    );

    const topSuppliers = await Orders.aggregate([
        {
            $group: {
                _id: "$supplier",
                totalOrders: { $sum: 1 },
            },
        },
        { $sort: { totalOrders: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "suppliers",
                localField: "_id",
                foreignField: "_id",
                as: "supplier",
            },
        },
        { $unwind: "$supplier" },
        {
            $project: {
                name: "$supplier.name",
                totalOrders: 1,
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalItems,
                lowStockItems,
                recentOrders: recentOrderSummary,
                topSuppliers,
            },
            "Dashboard stats fetched"
        )
    );
});

export { getDashboardStats };
