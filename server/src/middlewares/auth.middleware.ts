import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access Denied. No token provided." });
    return; // ✅ Ensures function exits after response
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };

    if (decoded.role !== "Admin") {
      res.status(403).json({ message: "Access forbidden. Admins only." });
      return; // ✅ Ensures function exits after response
    }

    next(); // ✅ Pass control to the next middleware
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
    return; // ✅ Ensures function exits after response
  }
};

const authenticateUser = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Access Denied. No token provided." });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };

      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: "Access forbidden." });
        return;
      }

      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token." });
    }
  };
};

export { authenticateAdmin , authenticateUser };
