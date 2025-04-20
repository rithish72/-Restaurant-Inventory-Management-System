import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app.js";

const baseUrl = "/api/v1/suppliers";

let supplierId;

const supplierPayload = {
    supplier: "Test Supplier",
    contactPerson: "Arjun",
    phoneNumber: "9876543210",
    email: "supplier@example.com",
    address: "123 Test Street, Test City",
    itemsSupplied: ["Rice", "Oil"],
};

beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test-db", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Suppliers API", () => {
    test("POST /add - should create a new supplier", async () => {
        const res = await request(app)
            .post(`${baseUrl}/add`)
            .send(supplierPayload);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(supplierPayload.email);

        supplierId = res.body.data._id;
    });

    test("GET / - should fetch all suppliers", async () => {
        const res = await request(app).get(baseUrl);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("GET /:id - should fetch a supplier by ID", async () => {
        const res = await request(app).get(`${baseUrl}/${supplierId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(supplierId);
    });

    test("PUT /update/:id - should update the supplier", async () => {
        const updatedPayload = {
            supplier: "Updated Supplier",
            contactPerson: "Arjun",
            phoneNumber: "1112223333",
            email: "updated@example.com",
            address: "456 Updated Street",
            itemsSupplied: ["Flour", "Sugar"],
        };

        const res = await request(app)
            .put(`${baseUrl}/update/${supplierId}`)
            .send(updatedPayload);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.name).toBe("Updated Supplier");
        expect(res.body.data.email).toBe("updated@example.com");
    });

    test("DELETE /delete/:id - should delete the supplier", async () => {
        const res = await request(app).delete(
            `${baseUrl}/delete/${supplierId}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(supplierId);
    });
});
