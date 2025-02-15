import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import sendEmail from "../utils/emailService";

const prisma = new PrismaClient();

// Add Floor
export const addFloor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    // Check if floor already exists
    const existingFloor = await prisma.floor.findUnique({ where: { name } });
    if (existingFloor) {
      res.status(400).json({ error: "Floor already exists!" });
      return;
    }

    const floor = await prisma.floor.create({ data: { name } });
    res.status(201).json(floor);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Add Room and Assign to Floor
export const addRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, floorId, floorName } = req.body;

    // Find floor by ID or name
    let floor = null;
    if (floorId) {
      floor = await prisma.floor.findUnique({ where: { id: floorId } });
    } else if (floorName) {
      floor = await prisma.floor.findUnique({ where: { name: floorName } });
    }

    if (!floor) {
      res.status(404).json({ error: "Floor not found!" });
      return;
    }

    // Check if room already exists
    const existingRoom = await prisma.room.findUnique({ where: { name } });
    if (existingRoom) {
       res.status(400).json({ error: "Room already exists!" });
        return;
    }

    // Create new room
    const room = await prisma.room.create({
      data: {
        name,
        floorId: floor.id, // Ensure we use the correct floor ID
      },
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


// Check If Room Is Assigned
export const checkRoomAssigned = async (req: Request, res: Response): Promise<void> => {
  try {
    let { roomId } = req.params;

    // Remove the leading colon (:) if present
    if (roomId.startsWith(":")) {
      roomId = roomId.substring(1);
    }

    console.log("Fixed roomId:", roomId); // Debugging log

    const assignedRoom = await prisma.studentRoom.findFirst({
      where: { roomId },
    });

    console.log("Found assignedRoom:", assignedRoom);

    res.status(200).json({ assigned: !!assignedRoom });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};


// Assign Student to Room
/* export const assignStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId, roomName, studentId, studentName } = req.body;

    // Find the room by ID or name
    let room = null;
    if (roomId) {
      room = await prisma.room.findUnique({ where: { id: roomId } });
    } else if (roomName) {
      room = await prisma.room.findUnique({ where: { name: roomName } });
    }

    if (!room) {
      res.status(404).json({ error: "Room not found!" });
      return ;
    }

    // Find the student by ID or name
    let student = null;
    if (studentId) {
      student = await prisma.user.findUnique({ where: { id: studentId } });
    } else if (studentName) {
      student = await prisma.user.findFirst({ where: { name: studentName } });
    }

    if (!student) {
      res.status(404).json({ error: "Student not found!" });
      return ;
    }

    // Check if student is already assigned to a room
    const existingAssignment = await prisma.studentRoom.findUnique({
      where: { studentId: student.id },
    });

    if (existingAssignment) {
      res.status(400).json({ error: "Student is already assigned to a room!" });
      return ;
    }

    // Assign the student to the room
    const assignment = await prisma.studentRoom.create({
      data: {
        studentId: student.id,
        roomId: room.id,
      },
    });

    res.status(201).json({ message: "Room assigned successfully!", assignment });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}; */

export const assignStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId, roomName, studentId, studentName } = req.body;

    // Find the room by ID or name
    let room = null;
    if (roomId) {
      room = await prisma.room.findUnique({ where: { id: roomId } });
    } else if (roomName) {
      room = await prisma.room.findUnique({ where: { name: roomName } });
    }

    if (!room) {
      res.status(404).json({ error: "Room not found!" });
      return;
    }

    // Find the student by ID or name
    let student = null;
    if (studentId) {
      student = await prisma.user.findUnique({ where: { id: studentId } });
    } else if (studentName) {
      student = await prisma.user.findFirst({ where: { name: studentName } });
    }

    if (!student) {
      res.status(404).json({ error: "Student not found!" });
      return;
    }

    // Check if student is already assigned to a room
    const existingAssignment = await prisma.studentRoom.findUnique({
      where: { studentId: student.id },
    });

    if (existingAssignment) {
      res.status(400).json({ error: "Student is already assigned to a room!" });
      return;
    }

    // Assign the student to the room
    const assignment = await prisma.studentRoom.create({
      data: {
        studentId: student.id,
        roomId: room.id,
      },
    });

    // Send Email Notification
    const emailSubject = "Hostel Room Assignment Confirmation";
    const emailBody = `
      <h2>Hello ${student.name},</h2>
      <p>You have been assigned to <strong>Room: ${room.name}</strong>.</p>
      <p>For any queries, please contact the hostel management.</p>
      <br/>
      <p>Regards,<br/>Hostel Management Team</p>
    `;

    await sendEmail(student.email, emailSubject, emailBody);

    res.status(201).json({ message: "Room assigned successfully! Email sent.", assignment });
  } catch (error) {
    console.error("Error in assignStudent:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
// Get All Floors with Rooms
export const getFloors = async (req: Request, res: Response) => {
  try {
    const floors = await prisma.floor.findMany({
      include: { rooms: true },
    });

    res.status(200).json(floors);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
