import express from "express";
import authMiddleWare from "../middlewares/auth.middleware";
import userController from "../controllers/user/user.controler";
import authController from "../controllers/user/auth.controler";
import passwordController from "../controllers/user/password.controler";

const router = express.Router();

// public routes
router.post("/register", authController.registerUser);
router.post(
  "/verify-email-for-register",
  authController.verifyEmailForRegister
);
router.post("/resend-code", authController.resendCode);
router.post("/login", authController.loginUser);
router.post("/forgot-password", passwordController.forgotPassword);
// private routes
router.get("/get-all-users", authMiddleWare, userController.getAllUsers);
router.get(
  "/get-users-page",
  authMiddleWare,
  userController.getUsersByPageSize
);
router.put(
  "/update-user-credentials",
  authMiddleWare,
  userController.updateUserCredentials
);
router.delete("/delete-user", authMiddleWare, userController.deleteUser);
router.put(
  "/toogle-block-user",
  authMiddleWare,
  userController.toogleBlockUser
);
router.put(
  "/change-password",
  authMiddleWare,
  passwordController.updateUserPassword
);

export default router;
