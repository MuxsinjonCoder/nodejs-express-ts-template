import mongoose from "mongoose";
import sendResponse from "../utils/response";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    return sendResponse({
      res: null,
      statusCode: 409,
      success: false,
      message: "MongoDB URI incorrect",
    });
  }
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

export default connectDB;
