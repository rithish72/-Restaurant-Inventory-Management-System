import { connectDB } from "./config/db.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(
                `Server is running on port ${process.env.PORT || 5000}`
            );
        });
    })
    .catch((err) => {
        console.error("DB connection failed", err);
        process.exit(1);
    });
