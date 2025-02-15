import express from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

// Admin login route
router.post("/admin/login", AuthController.loginAdmin);
router.post("/login", AuthController.login);

export default router;
