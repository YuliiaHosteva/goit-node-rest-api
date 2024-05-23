import express from 'express';
import { uploadAvatar } from "../controllers/userControllers.js"
import upload from "../middlewares/upload.js"

const router = express.Router();

router.patch("/avatar", upload.single("avatar"), uploadAvatar);

export default router;