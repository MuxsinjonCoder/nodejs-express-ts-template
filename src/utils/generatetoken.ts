import sendResponse from "./response";
import jwt from "jsonwebtoken";

const generateToken = (id: string | number) => {
  try {
    const token = jwt.sign(
      { userId: id },
      process.env.JWT_SECRET || "secret-key-here",
      { expiresIn: "72h" }
    );

    return token;
  } catch (error) {
    console.log(error);
    return sendResponse({
      res: null,
      statusCode: 500,
      success: false,
      message: "Internal Server Error!!!",
      data: null,
      error: error,
    });
  }
};

export default generateToken;
