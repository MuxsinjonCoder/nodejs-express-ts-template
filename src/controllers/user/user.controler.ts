import User from "../../models/user.model";
import generateToken from "../../utils/generatetoken";
import sendEmail from "../../utils/sendcode";
import bcrypt from "bcrypt";
import sendPassword from "../../utils/sendpassword";
import { Request, Response } from "express";
import sendResponse from "../../utils/response";

// get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "All users got successfully.",
      data: users,
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      res: res,
      statusCode: 500,
      success: false,
      message: "Internal Server Error!!!",
      data: null,
      error: error,
    });
  }
};

// get users by page size
const getUsersByPageSize = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const skip = (page - 1) * size;

    const users = await User.find().skip(skip).limit(size);
    const elements = await User.countDocuments();
    const totalPages = Math.ceil(elements / size) || 1;

    return sendResponse({
      res: res,
      statusCode: 200,
      success: true,
      message: "Users got with page, size",
      data: {
        data: users,
        elements: elements,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      res: res,
      statusCode: 500,
      success: false,
      message: "Internal Server Error!!!",
      data: null,
      error: error,
    });
  }
};

// update user credentials
const updateUserCredentials = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const id = (req.query.id as string).replace(/\\/g, "");

    if (!id || id === "0") {
      return sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "User not found, please provide exist user ID!!!",
      });
    }

    if (!email || !name) {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Please provide all fields!!!",
      });
    }

    const checkedUser = await User.findById(id);

    if (!checkedUser) {
      sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "User not found with this ID",
      });
    }

    if (checkedUser?._id) {
      await User.updateOne(
        { _id: checkedUser._id },
        {
          $set: {
            name: name,
            email: email,
          },
        }
      );
    } else {
      return sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "Cannot get user ID from SERVER!!!",
      });
    }

    const updatedUser = await User.findById(checkedUser?._id);

    return sendResponse({
      res: res,
      statusCode: 200,
      success: true,
      message: "User credentials updated.",
      data: {
        data: updatedUser,
      },
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      res: res,
      statusCode: 500,
      success: false,
      message: "Internal Server Error!!!",
      data: null,
      error: error,
    });
  }
};

// delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = (req.query.id as string).replace(/\\/g, "");

    if (!id || id === "0") {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Please provide user ID for delete!!!",
      });
    }

    const checkedUser = await User.findById(id);

    if (!checkedUser) {
      sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "User not found with this ID",
      });
    }

    await User.findByIdAndDelete(id);

    return sendResponse({
      res: res,
      statusCode: 200,
      success: true,
      message: `${checkedUser?.name} deleted!!!`,
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      res: res,
      statusCode: 500,
      success: false,
      message: "Internal Server Error!!!",
      data: null,
      error: error,
    });
  }
};

// block user
const toogleBlockUser = async (req: Request, res: Response) => {
  try {
    const { id, isBlocked } = req.query;

    if (!id || id === "0") {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Please provide user ID for block!!!",
      });
    }

    const checkedUser = await User.findById(id);

    if (!checkedUser) {
      sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "User not found with this ID",
      });
    }

    if (String(checkedUser?.isBlocked) === String(isBlocked)) {
      return sendResponse({
        res: res,
        statusCode: 409,
        success: false,
        message: `${checkedUser?.name} is already ${
          String(isBlocked) == "true" ? "blocked!!!" : "unblocked"
        }`,
      });
    }

    await User.updateOne(
      { _id: id },
      {
        $set: {
          isBlocked: isBlocked,
        },
      }
    );

    return sendResponse({
      res: res,
      statusCode: 200,
      success: true,
      message: `${checkedUser?.name} is ${
        String(isBlocked) == "true" ? "blocked!!!" : "unblocked"
      }`,
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      res: res,
      statusCode: 500,
      success: false,
      message: "Internal Server Error!!!",
      data: null,
      error: error,
    });
  }
};

export default {
  getAllUsers,
  getUsersByPageSize,
  updateUserCredentials,
  deleteUser,
  toogleBlockUser,
};
