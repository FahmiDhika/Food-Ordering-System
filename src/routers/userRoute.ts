import express from "express";
import { changeProfile, createUser, deleteUser, getAllUser, updateUser } from "../controllers/userController";
import { verifyAddUser, verifyEditUser } from "../middlewares/verifyUser";
import uploadFile from "../middlewares/userUpload";

const app = express()
app.use(express.json())

app.get(`/`, getAllUser)
app.post(`/`, [verifyAddUser], createUser)
app.put(`/:id`, [verifyEditUser], updateUser)
app.put(`/pic/:id`, [uploadFile.single("picture")], changeProfile)
app.delete(`/:id`, deleteUser)

export default app