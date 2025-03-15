import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserPayload {
  id: number;
  email: string;
}

interface CustomRequest extends Request {
  user?: UserPayload;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access token is missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.user = decoded as UserPayload;
    return next();
  } catch (err) {
    res.status(401).json({ message: "Access token is missing or invalid" });
    return;
  }
};
