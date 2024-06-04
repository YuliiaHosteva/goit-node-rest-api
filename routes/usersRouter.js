import express from 'express';
import { uploadAvatar, verifyUser, requestVerificationToken } from "../controllers/userControllers.js"
import upload from "../middlewares/upload.js"
import { verificationTokenSchema } from '../schemas/usersSchemas.js';
import validateBody from '../helpers/validateBody.js';

const userRouter = express.Router();

userRouter.patch("/avatar", upload.single("avatar"), uploadAvatar);

userRouter.get("/verify/:verificationToken", verifyUser);

userRouter.post("/verify", validateBody(verificationTokenSchema), requestVerificationToken);

export default userRouter;