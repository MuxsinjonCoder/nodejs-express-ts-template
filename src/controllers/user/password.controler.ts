import User from "../../models/user.model";
import generateToken from "../../utils/generatetoken";
import sendEmail from "../../utils/sendcode";
import bcrypt from "bcrypt";
import sendPassword from "../../utils/sendpassword";
import { Request, Response } from "express";
import sendResponse from "../../utils/response";

// forgot password
const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // checking
    if (!email) {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Please provide email!!!",
      });
    }

    const checkedUser = await User.findOne({ email });

    if (!checkedUser) {
      return sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "User with this email is not found!!!",
      });
    }

    // send password to email
    await sendPassword({
      to: email,
      subject: "Yout password...",
      code: checkedUser.password,
    });

    return sendResponse({
      res: res,
      statusCode: 200,
      success: true,
      message: "Your password send to your email.",
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

// update user password
const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = (req.query.id as string).replace(/\\/g, "");

    if (!id || id === "0") {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Please provide user ID for update user!!!",
      });
    }

    if (!oldPassword || !newPassword) {
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

    if (checkedUser?.hashedPassword) {
      const isOldPasswordMatched = await bcrypt.compare(
        oldPassword,
        checkedUser?.hashedPassword
      );

      if (!isOldPasswordMatched) {
        return sendResponse({
          res: res,
          statusCode: 401,
          success: false,
          message: "Old password is incorrect!!!",
        });
      }
    } else {
      return sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "Cannot get user's hashed password form SERVER!!!",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: id },
      { $set: { hashedPassword: hashedNewPassword, password: newPassword } }
    );

    return sendResponse({
      res: res,
      statusCode: 200,
      success: true,
      message: `${checkedUser?.name} changed password successfully.`,
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

export default { forgotPassword, updateUserPassword };
