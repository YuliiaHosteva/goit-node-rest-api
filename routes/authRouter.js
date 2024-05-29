import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  changeSubscription,
} from "../controllers/authControllers.js";
import { userSchema, subscriptionSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authToken from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(userSchema), register);

authRouter.post("/login", validateBody(userSchema), login);

authRouter.get("/logout", authToken, logout);

authRouter.get("/current", authToken, getCurrentUser);

authRouter.patch("", authToken, validateBody(subscriptionSchema), changeSubscription);

export default authRouter;