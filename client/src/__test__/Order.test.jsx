import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Orders from "../Orders";
import api from "../../../api/api";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("../../../api/api");
jest.mock("react-toastify", () => ({
    toast: { error: jest.fn(), success: jest.fn() },
}));

describe("Orders Component", () => {
    const mockOrders = [
        {
            _id: "1",
            orderNumber: "ORD001",
            supplier: { name: "Supplier A", email: "a@example.com" },
            items: [
                { item: { name: "Tomatoes" }, quantity: 10 },
                { item: { name: "Cheese" }, quantity: 5 },
            ],
            status: "Pending",
            deliveryDate: new Date().toISOString(),
        },
    ];

    beforeEach(() => {
        document.body.classList.remove("dark-mode");
        jest.clearAllMocks();
    });

    test("renders and loads orders correctly", async () => {
        api.get.mockResolvedValueOnce({ data: { data: mockOrders } });

        render(
            <Router>
                <Orders />
            </Router>
        );

        expect(screen.getByText(/Orders List/i)).toBeInTheDocument();
        expect(screen.getByText(/Add Order/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("ORD001")).toBeInTheDocument();
            expect(screen.getByText("Supplier A")).toBeInTheDocument();
            expect(screen.getByText("a@example.com")).toBeInTheDocument();
        });
    });

    test("displays error and retry option if fetching orders fails", async () => {
        api.get.mockRejectedValueOnce(new Error("API error"));

        render(
            <Router>
                <Orders />
            </Router>
        );

        await waitFor(() => {
            expect(
                screen.getByText(/Failed to fetch orders/i)
            ).toBeInTheDocument();
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to fetch orders. Try again later."
            );
        });
    });

    test("calls delete API when deleting an order", async () => {
        api.get.mockResolvedValueOnce({ data: { data: mockOrders } });
        api.delete.mockResolvedValueOnce({});

        window.confirm = jest.fn(() => true);

        render(
            <Router>
                <Orders />
            </Router>
        );

        await waitFor(() => screen.getByText("ORD001"));

        const deleteBtn = screen.getByRole("button", { name: /Delete/i });
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith(
                "/api/v1/orders/delete-order/1"
            );
            expect(toast.success).toHaveBeenCalledWith(
                "Order deleted successfully!"
            );
        });
    });
});
