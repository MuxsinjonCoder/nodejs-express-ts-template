import { Response } from "express";

interface SendResponsePropsTypes {
  res: Response | null;
  statusCode: number;
  success: boolean;
  message: string;
  data?: any | null;
  error?: any | null;
}

const sendResponse = ({
  res,
  statusCode,
  success,
  message,
  data = null,
  error = null,
}: SendResponsePropsTypes) => {
  const responseBody: any = {
    success,
    message,
  };

  if (data) responseBody.data = data;
  if (error) responseBody.error = error;

  if (!res) {
    return sendResponse({
      res: null,
      statusCode: 404,
      success: false,
      message: "Cannot find response!!!",
    });
  }
  return res.status(statusCode).json(responseBody);
};

export default sendResponse;
