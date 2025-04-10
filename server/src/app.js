import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(express.json(
    {
        limit: "32kb"
    }
));
app.use(express.urlencoded(
    {
        extended: true,
        limit: "32kb"
    }
));
app.use(express.static('public'));
app.use(cookieParser());

import userRoutes from './routes/user.routes.js';
// Routes
app.use("/api/v1/users", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Server is up and running 🚀");
});

export { app };
