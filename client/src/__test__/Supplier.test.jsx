import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Suppliers from "../pages/Suppliers/Suppliers";
import { BrowserRouter as Router } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

// Mock toast and API
jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../api/api");

describe("Suppliers Component", () => {
    beforeEach(() => {
        document.body.classList.remove("dark-mode");
    });

    test("renders loading spinner initially", () => {
        render(
            <Router>
                <Suppliers />
            </Router>
        );
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    test("renders supplier list after API call", async () => {
        api.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        _id: "1",
                        name: "Supplier A",
                        contactPerson: "Alice",
                        phone: "1234567890",
                        email: "alice@example.com",
                        address: "123 Street",
                        itemsSupplied: ["Item 1", "Item 2"],
                    },
                ],
            },
        });

        render(
            <Router>
                <Suppliers />
            </Router>
        );

        await waitFor(() =>
            expect(screen.getByText("Supplier A")).toBeInTheDocument()
        );

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Item 1, Item 2")).toBeInTheDocument();
    });

    test("shows no suppliers found alert", async () => {
        api.get.mockResolvedValueOnce({
            data: {
                data: [],
            },
        });

        render(
            <Router>
                <Suppliers />
            </Router>
        );

        await waitFor(() =>
            expect(screen.getByText("No suppliers found.")).toBeInTheDocument()
        );
    });

    test("shows error toast on fetch failure", async () => {
        api.get.mockRejectedValueOnce(new Error("Fetch failed"));

        render(
            <Router>
                <Suppliers />
            </Router>
        );

        await waitFor(() =>
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to fetch suppliers. Please try again."
            )
        );
    });

    test("deletes supplier after confirmation", async () => {
        window.confirm = jest.fn().mockReturnValue(true);

        api.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        _id: "1",
                        name: "Supplier A",
                        contactPerson: "Alice",
                        phone: "1234567890",
                        email: "alice@example.com",
                        address: "123 Street",
                        itemsSupplied: ["Item 1"],
                    },
                ],
            },
        });

        api.delete.mockResolvedValueOnce({});

        render(
            <Router>
                <Suppliers />
            </Router>
        );

        await waitFor(() =>
            expect(screen.getByText("Supplier A")).toBeInTheDocument()
        );

        const deleteBtn = screen.getByText("Delete");
        fireEvent.click(deleteBtn);

        await waitFor(() =>
            expect(toast.success).toHaveBeenCalledWith(
                "Supplier deleted successfully!"
            )
        );
    });
});
