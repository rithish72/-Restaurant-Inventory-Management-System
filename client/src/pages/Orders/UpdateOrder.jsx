import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const UpdateOrder = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [updatedOrder, setUpdatedOrder] = useState({
        orderNumber: "",
        items: [{ item: "", quantity: "" }],
        supplier: "",
        status: "",
        deliveryDate: "",
        notes: "",
        _id: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDarkMode(document.body.classList.contains("dark-mode"));
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });

        setDarkMode(document.body.classList.contains("dark-mode"));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchOrder = async () => {
                setLoading(true);
                try {
                    const response = await api.get(
                        `/api/v1/orders/get-order/${id}`
                    );
                    if (response.data?.data) {
                        const data = response.data.data;
                        const transformedItems = data.items.map((itemObj) => ({
                            item: itemObj.item.itemName || "",
                            quantity: itemObj.quantity || "",
                        }));

                        setUpdatedOrder({
                            orderNumber: data.orderNumber || "",
                            items: transformedItems,
                            supplier: data.supplier.name || "",
                            status: data.status || "",
                            deliveryDate: data.deliveryDate?.slice(0, 10) || "",
                            notes: data.notes || "",
                            _id: data._id || id,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching order:", error);
                    toast.error("Failed to fetch order data.");
                } finally {
                    setLoading(false);
                }
            };

            fetchOrder();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedOrder((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...updatedOrder.items];
        newItems[index][field] = value;
        setUpdatedOrder((prev) => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setUpdatedOrder((prev) => ({
            ...prev,
            items: [...prev.items, { item: "", quantity: "" }],
        }));
    };

    const removeItem = (index) => {
        const newItems = [...updatedOrder.items];
        newItems.splice(index, 1);
        setUpdatedOrder((prev) => ({ ...prev, items: newItems }));
    };

    const validateForm = () => {
        const { orderNumber, items, supplier, status, deliveryDate } =
            updatedOrder;
        return (
            typeof orderNumber === "string" &&
            orderNumber.trim() &&
            typeof supplier === "string" &&
            supplier.trim() &&
            typeof status === "string" &&
            status &&
            typeof deliveryDate === "string" &&
            deliveryDate &&
            Array.isArray(items) &&
            items.every(
                (i) => typeof i.item === "string" && i.item.trim() && i.quantity
            )
        );
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fill all required fields.");
            return;
        }

        const {
            orderNumber,
            items,
            supplier,
            status,
            deliveryDate,
            notes,
            _id,
        } = updatedOrder;

        const orderData = {
            orderNumber: orderNumber.trim(),
            items: items.map((i) => ({
                item: i.item,
                quantity: Number(i.quantity),
            })),
            supplier: supplier.trim(),
            status,
            deliveryDate,
            notes: typeof notes === "string" ? notes.trim() : "",
        };

        setLoading(true);
        setError(null);

        try {
            if (_id) {
                await api.patch(
                    `/api/v1/orders/update-order/${_id}`,
                    orderData
                );
                toast.success("Order updated successfully!");
            } else {
                await api.post("/api/v1/orders/add-order", orderData);
                toast.success("Order added successfully!");
            }
            navigate("/orders");
        } catch (error) {
            console.error("Error updating order:", error);
            setError("Failed to update order.");
            toast.error("Failed to update order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`container-db ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
        >
            <div className="dashboard-container mt-4 p-4">
                <h4
                    className={`fw-bold text-center ${darkMode ? "text-white" : "text-dark"}`}
                >
                    {id ? "Update Order" : "Add New Order"}
                </h4>

                {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                )}

                <div className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Order Number
                        </label>
                        <input
                            type="text"
                            name="orderNumber"
                            className="form-control"
                            placeholder="e.g. ORD-1001"
                            value={updatedOrder.orderNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-md-12">
                        <label className="form-label fw-semibold">Items</label>
                        {updatedOrder.items.map((itemObj, index) => (
                            <div className="row g-2 mb-3" key={index}>
                                <div className="col-md-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Item name"
                                        value={itemObj.item}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "item",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-md-5">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Quantity"
                                        value={itemObj.quantity}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "quantity",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button
                                        type="button"
                                        className="btn btn-danger w-100"
                                        onClick={() => removeItem(index)}
                                        disabled={
                                            updatedOrder.items.length === 1
                                        }
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-outline-primary mt-3"
                            onClick={addItem}
                        >
                            + Add Item
                        </button>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Supplier
                        </label>
                        <input
                            type="text"
                            name="supplier"
                            className="form-control"
                            placeholder="e.g. FreshFarms"
                            value={updatedOrder.supplier}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Status</label>
                        <select
                            name="status"
                            className="form-select"
                            value={updatedOrder.status}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Delivery Date
                        </label>
                        <input
                            type="date"
                            name="deliveryDate"
                            className="form-control"
                            value={updatedOrder.deliveryDate}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            className="form-control"
                            rows="1"
                            placeholder="Additional notes"
                            value={updatedOrder.notes}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <button
                    className="btn btn-success mt-4 w-100 fw-bold"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading
                        ? "Processing..."
                        : id
                          ? "Update Order"
                          : "Add Order"}
                </button>
            </div>
        </div>
    );
};

export default UpdateOrder;
