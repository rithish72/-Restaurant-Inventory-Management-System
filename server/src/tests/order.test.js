import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app.js";

const baseUrl = "/api/v1/orders";

let orderId;
let supplierId;
let itemId;

const supplierPayload = {
    name: "Test Supplier",
    contactPerson: "Arjun",
    email: "test@example.com",
    phone: "1234567890",
};

const inventoryPayload = {
    itemName: "Test Item",
    category: "Dry Goods",
    threshold: 5,
    quantity: 20,
    unit: "kg",
};

const orderPayload = {
    orderNumber: "ORD-001",
    items: [{ item: "Test Item", quantity: 10 }],
    supplier: "Test Supplier",
    status: "Pending",
    deliveryDate: new Date().toISOString(),
    notes: "Urgent delivery",
};

beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test-db", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const supplierRes = await request(app)
        .post("/api/v1/suppliers/add")
        .send(supplierPayload);

    supplierId = supplierRes.body.data._id;

    const inventoryRes = await request(app)
        .post("/api/v1/inventory/add")
        .send(inventoryPayload);

    itemId = inventoryRes.body.data._id;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Orders API", () => {
    test("POST /add - should create a new order", async () => {
        const res = await request(app)
            .post(`${baseUrl}/add`)
            .send(orderPayload);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.orderNumber).toBe("ORD-001");

        orderId = res.body.data._id;
    });

    test("GET / - should return all orders", async () => {
        const res = await request(app).get(`${baseUrl}/`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("GET /:id - should return single order by ID", async () => {
        const res = await request(app).get(`${baseUrl}/${orderId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(orderId);
    });

    test("PUT /update/:id - should update order details", async () => {
        const updated = {
            ...orderPayload,
            orderNumber: "ORD-002",
            notes: "Updated Note",
        };

        const res = await request(app)
            .put(`${baseUrl}/update/${orderId}`)
            .send(updated);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.orderNumber).toBe("ORD-002");
        expect(res.body.data.notes).toBe("Updated Note");
    });

    test("DELETE /delete/:id - should delete the order", async () => {
        const res = await request(app).delete(`${baseUrl}/delete/${orderId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(orderId);
    });
});
