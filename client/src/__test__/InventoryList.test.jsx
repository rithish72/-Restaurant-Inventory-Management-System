import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import InventoryList from "../components/InventoryList";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

jest.mock("axios");
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("InventoryList Component", () => {
    const mockItems = [
        {
            _id: "1",
            itemName: "Tomato",
            category: "Vegetable",
            quantity: 50,
            unit: "kg",
            threshold: 10,
            updatedAt: new Date().toISOString(),
        },
        {
            _id: "2",
            itemName: "Cheese",
            category: "Dairy",
            quantity: 20,
            unit: "kg",
            threshold: 5,
            updatedAt: new Date().toISOString(),
        },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({
            data: {
                data: mockItems,
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders loading spinner and then displays inventory items", async () => {
        renderWithRouter(<InventoryList />);

        expect(screen.getByRole("status")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Tomato")).toBeInTheDocument();
            expect(screen.getByText("Cheese")).toBeInTheDocument();
        });

        expect(screen.getByText("Inventory List")).toBeInTheDocument();
        expect(screen.getByText("Add Item")).toBeInTheDocument();
    });

    it("shows message when inventory is empty", async () => {
        axios.get.mockResolvedValueOnce({ data: { data: [] } });

        renderWithRouter(<InventoryList />);

        await waitFor(() => {
            expect(
                screen.getByText("No inventory items found.")
            ).toBeInTheDocument();
        });
    });

    it("handles delete confirmation and API call", async () => {
        window.confirm = jest.fn(() => true);

        axios.delete.mockResolvedValueOnce({ status: 200 });

        renderWithRouter(<InventoryList />);

        await waitFor(() => {
            expect(screen.getByText("Tomato")).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(
                "/api/v1/inventory/delete-inventory-item/1"
            );
            expect(toast.success).toHaveBeenCalledWith(
                "Item deleted successfully!"
            );
        });
    });

    it("cancels delete when confirmation is rejected", async () => {
        window.confirm = jest.fn(() => false); // Simulate clicking "Cancel"

        renderWithRouter(<InventoryList />);

        await waitFor(() => {
            expect(screen.getByText("Tomato")).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);

        expect(axios.delete).not.toHaveBeenCalled();
    });
});
