import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Supplier } from "../models/supplier.models.js";
import mongoose from "mongoose";

// Get all suppliers
const getAllSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                suppliers,
                "All suppliers fetched successfully."
            )
        );
});

//Get new Supplier
const getCurrentSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Supplier ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Supplier ID format");
    }

    const existingSupplier = await Supplier.findById(id);

    if (!existingSupplier) {
        throw new ApiError(404, "Supplier not found");
    }

    return res.status(200).json(
        new ApiResponse(200, existingSupplier, "Supplier retrieved successfully")
    );
});


// Add a new supplier
const addSupplier = asyncHandler(async (req, res) => {
    const {
        supplier,
        contactPerson,
        phoneNumber,
        email,
        address,
        itemsSupplied,
    } = req.body;

    if (
        !supplier ||
        !contactPerson ||
        !phoneNumber ||
        !email ||
        !address ||
        !itemsSupplied
    ) {
        throw new ApiError(400, "All fields are required.");
    }

    const existingSupplier = await Supplier.findOne({ email });

    if (existingSupplier) {
        throw new ApiError(409, "Supplier already exists with this email.");
    }

    const newSupplier = await Supplier.create({
        name: supplier,
        contactPerson,
        email,
        phone: phoneNumber,
        address,
        itemsSupplied,
    });

    if (!newSupplier) {
        throw new ApiError(500, "Failed to create supplier.");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, newSupplier, "Supplier successfully added.")
        );
});

// Update a supplier by ID
const updateSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { supplier, phoneNumber, email, address, itemsSupplied } = req.body;

    if (!supplier || !phoneNumber || !email || !address || !itemsSupplied) {
        throw new ApiError(400, "All fields are required.");
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
        id,
        {
            name: supplier,
            email,
            phone: phoneNumber,
            address,
            itemsSupplied,
        },
        { new: true }
    );

    if (!updatedSupplier) {
        throw new ApiError(404, "Supplier not found.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedSupplier,
                "Supplier updated successfully."
            )
        );
});

// Delete a supplier by ID
const deleteSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    if (!deletedSupplier) {
        throw new ApiError(404, "Supplier not found.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedSupplier,
                "Supplier deleted successfully."
            )
        );
});

export { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier, getCurrentSupplier };
