import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/response";
import jwt from "jsonwebtoken";

const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    sendResponse({
      res: res,
      statusCode: 401,
      success: false,
      message: "Unauthorized: Access is denied due to invalid credentials",
    });
  }

  try {
    if (!token) {
      return sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "Cannot find token!!!",
      });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-key-here"
    );

    res.locals.user = decoded;
    next();
  } catch (error) {
    sendResponse({
      res: res,
      statusCode: 401,
      success: false,
      message: "Unauthorized: Access is denied due to invalid token",
    });
  }
};

export default authMiddleWare;
