import express from "express";
import {
  authentication,
  changeProfile,
  createUser,
  deleteUser,
  getAllUser,
  getProfile,
  updateUser,
} from "../controllers/userController";
import {
  verifyAddUser,
  verifyAuthentication,
  verifyEditUser,
} from "../middlewares/verifyUser";
import { verifyRole, verifyToken } from "../middlewares/authorization";
import uploadFile from "../middlewares/userUpload";

const app = express();
app.use(express.json());

app.get(`/get`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getAllUser);
app.get(`/profile`, verifyToken, getProfile);
app.post(
  `/create`,
  [
    verifyToken,
    verifyRole(["MANAGER"]),
    uploadFile.single("profile_picture"),
    verifyAddUser,
  ],
  createUser
);
app.post(`/login`, verifyAuthentication, authentication);
app.put(
  `/:id`,
  [
    verifyToken,
    verifyRole(["MANAGER"]),
    uploadFile.single("profile_picture"),
    verifyEditUser,
  ],
  updateUser
);
// app.put(`/pic/:id`, [uploadFile.single("profile_picture")], changeProfile);
app.delete(`/:id`, [verifyToken, verifyRole(["MANAGER"])], deleteUser);

export default app;
