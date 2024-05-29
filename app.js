import path from "node:path";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import contactsRoutes from "./routes/contactsRouter.js";
import authRoutes from "./routes/authRouter.js";
import authToken from "./middlewares/auth.js";
import userRoutes from "./routes/usersRouter.js"


const app = express();

const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", authToken, contactsRoutes);
app.use("/api/users", authRoutes);
app.use("/users", userRoutes);
app.use("/avatars", express.static(path.resolve("public/avatars")));


app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
