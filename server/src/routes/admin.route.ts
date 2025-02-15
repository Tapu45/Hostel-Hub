import express from "express";
import {
  addFloor,
  addRoom,
  checkRoomAssigned,
  assignStudent,
  getFloors,
} from "../controllers/adminController";

const router = express.Router();

// Floor Routes
router.post("/floor", addFloor);

// Room Routes
router.post("/room", addRoom);
router.get("/room/assigned/:roomId", checkRoomAssigned);

// Assign Student to Room
router.post("/room/assign", assignStudent);

// Get All Floors
router.get("/floors", getFloors);

export default router;
