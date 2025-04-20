import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app.js"; 

const baseUrl = "/api/v1/inventory";

beforeAll(async () => {
    const dbUri = "mongodb://127.0.0.1:27017/test-db";
    await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Inventory API Endpoints", () => {
    let itemId;

    test("POST /add - should add a new inventory item", async () => {
        const newItem = {
            itemName: "Test Item",
            category: "Test Category",
            threshold: 5,
            quantity: 10,
            unit: "kg",
        };

        const res = await request(app).post(`${baseUrl}/add`).send(newItem);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.itemName).toBe("Test Item");

        itemId = res.body.data._id;
    });

    test("GET / - should fetch all inventory items", async () => {
        const res = await request(app).get(`${baseUrl}/`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("GET /:id - should fetch current item by ID", async () => {
        const res = await request(app).get(`${baseUrl}/${itemId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(itemId);
    });

    test("PUT /update/:id - should update an inventory item", async () => {
        const updatedData = {
            itemName: "Updated Item",
            category: "Updated Category",
            threshold: 3,
            quantity: 15,
            unit: "pcs",
        };

        const res = await request(app)
            .put(`${baseUrl}/update/${itemId}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.itemName).toBe("Updated Item");
    });

    test("DELETE /delete/:id - should delete an inventory item", async () => {
        const res = await request(app).delete(`${baseUrl}/delete/${itemId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(itemId);
    });
});
