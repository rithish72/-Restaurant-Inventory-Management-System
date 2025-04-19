import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "32kb",
    })
);
app.use(
    express.urlencoded({
        extended: true,
        limit: "32kb",
    })
);
app.use(express.static("public"));
app.use(cookieParser());

import userRoutes from "./routes/user.routes.js";
import inventoryRoute from "./routes/inventory.routes.js";
import supplierRoute from "./routes/supplier.routes.js";
import orderRoute from "./routes/order.routes.js";
import dashboardRoute from "./routes/dashboard.routes.js";
import adminRoute from "./routes/admin.route.js"
import authRoute from "./routes/auth.route.js"
// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/inventory", inventoryRoute);
app.use("/api/v1/suppliers", supplierRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/auth", authRoute)

// Default route
app.get("/", (req, res) => {
    res.send("Server is up and running");
});

export { app };
