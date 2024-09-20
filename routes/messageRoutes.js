import express from "express";
import { sendMessage, getMessage } from "../controller/message.js";
import protectRoute from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/send/:recieverId", protectRoute, sendMessage);
router.get("/:recieverId", protectRoute, getMessage);

export default router;
