import express from "express";
import { authentication, changeProfile, createUser, deleteUser, getAllUser, updateUser } from "../controllers/userController";
import { verifyAddUser, verifyAuthentication, verifyEditUser } from "../middlewares/verifyUser";
import uploadFile from "../middlewares/userUpload";

const app = express()
app.use(express.json())

app.get(`/get`, getAllUser)
app.post(`/create`, [verifyAddUser], createUser)
app.post(`/login`, verifyAuthentication, authentication)
app.put(`/:id`, [verifyEditUser], updateUser)
app.put(`/pic/:id`, [uploadFile.single("profile_picture")], changeProfile)
app.delete(`/:id`, deleteUser)

export default app