import express from "express";
import getUser from "../controller/user.js";
import protectedRoute from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/get", protectedRoute, getUser);

export default router;
