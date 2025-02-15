import { Request, Response, NextFunction, RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class AuthController {
  static loginAdmin: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email, password } = req.body;

    try {
      // Find admin user
      const admin = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (!admin || admin.role.name !== "Admin") {
        res.status(401).json({ message: "Unauthorized access!" });
        return; // Explicitly return void
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials!" });
        return;
      }

      // Generate JWT Token
      const token = jwt.sign(
        { userId: admin.id, role: admin.role.name },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

      res.json({ message: "Login successful", token });
      return; // Explicit return to match Promise<void>
    } catch (error) {
      next(error); // Properly forward the error
    }
  };

  static login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email, password } = req.body;

    try {
      // Find the user
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (!user) {
        res.status(401).json({ message: "Invalid credentials!" });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials!" });
        return;
      }

      // Generate JWT Token
      const token = jwt.sign(
        { userId: user.id, role: user.role.name },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        role: user.role.name, // Return role so frontend can display correct sections
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
