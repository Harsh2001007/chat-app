import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getUsersForSideBar,
  getMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/user", protectRoute, getUsersForSideBar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
