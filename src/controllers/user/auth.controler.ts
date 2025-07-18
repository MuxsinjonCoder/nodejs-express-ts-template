import User from "../../models/user.model";
import generateToken from "../../utils/generatetoken";
import sendEmail from "../../utils/sendcode";
import bcrypt from "bcrypt";
import sendPassword from "../../utils/sendpassword";
import { Request, Response } from "express";
import sendResponse from "../../utils/response";

const verificationCodes = new Map();

// register user
const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // checking user datas
    if (!name || !email || !password) {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Please provide all fields!!!",
      });
    }

    const existUserEmail = await User.findOne({ email });

    if (existUserEmail) {
      return sendResponse({
        res: res,
        statusCode: 409,
        success: false,
        message: "This email already exist!!!",
      });
    }

    // send code to email
    const code = Math.floor(10000 * Math.random() * 90).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000;

    console.log("register code:", code);

    verificationCodes.set(email, {
      code: code,
      expiresAt: expiresAt,
      userDto: {
        email: email,
        name: name,
        password: password,
      },
    });

    await sendEmail({ to: email, subject: "Confirm email", code: code });

    return sendResponse({
      res: res,
      statusCode: 200,
      success: true,
      message: "Verification code sent to email.",
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      res: res,
      statusCode: 500,
      success: false,
      message: "Internal Server Error!!!",
      data: null,
      error,
    });
  }
};

// verify email after sent sms
const verifyEmailForRegister = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    // checking request
    if (!email || !code) {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Please provide all fields!!!",
      });
    }

    const record = verificationCodes.get(email);

    if (!record) {
      return sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "Any verification code found for this email!!!",
      });
    } else if (Date.now() > record.expiresAt) {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Verification code expired",
      });
    } else if (record.code != code) {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Invalid verification code",
      });
    }

    const { name, password } = record.userDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      hashedPassword: hashedPassword,
      loginedCount: 1,
      password: password,
    });

    await newUser.save();
    verificationCodes.delete(email);

    const token = generateToken(newUser._id.toString());

    return sendResponse({
      res: res,
      statusCode: 201,
      success: true,
      message: "User registrated successfully.",
      data: {
        name: newUser?.name,
        email: newUser?.email,
        token: token,
        loginedCount: 1,
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

// resend code to email
const resendCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // checking
    if (!email) {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Please provide all fields!!!",
      });
    }

    const record = verificationCodes.get(email);

    if (!record) {
      return sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "No pending verification found for this email!!!",
      });
    }

    // send code to email
    const code = Math.floor(10000 * Math.random() * 90).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000;

    console.log("resend code:", code);

    verificationCodes.set(email, {
      code: code,
      expiresAt: expiresAt,
      userDto: record.userDto,
    });

    await sendEmail({ to: email, subject: "Confirm email", code });

    return sendResponse({
      res: res,
      statusCode: 200,
      success: true,
      message: "Verification code sent to email.",
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

// login user
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // checking
    if (!email || !password) {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Please provide all fields!!!",
      });
    }

    const checkedUser = await User.findOne({ email });

    if (!checkedUser) {
      return sendResponse({
        res: res,
        statusCode: 404,
        success: false,
        message: "User is not registrated yet!!!",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      checkedUser.hashedPassword
    );

    if (!isPasswordMatched) {
      return sendResponse({
        res: res,
        statusCode: 400,
        success: false,
        message: "Password is incorrect!!!",
      });
    }

    // add 1 to logined count
    await User.updateOne({ email }, { $inc: { loginedCount: 1 } });

    // generate token
    const token = generateToken(checkedUser._id.toString());

    // logined
    return sendResponse({
      res: res,
      statusCode: 200,
      success: true,
      message: "User logined successfully.",
      data: {
        name: checkedUser.name,
        email: checkedUser.email,
        token: token,
        createdAt: checkedUser.createdAt,
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

export default {
  registerUser,
  verifyEmailForRegister,
  resendCode,
  loginUser,
};
