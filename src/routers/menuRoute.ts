import express from "express";
import { getAllMenus, updateMenu, createMenu, deleteMenu, changePicture } from "../controllers/menuController";
import { verifyAddMenu, verifyEditMenu } from "../middlewares/verifyMenu";
import uploadFile from "../middlewares/menuUpload";

const app = express()
app.use(express.json())

app.get(`/get`, getAllMenus)
app.post(`/add`, [verifyAddMenu], createMenu)
app.put(`/:id`, [verifyEditMenu], updateMenu)
app.put(`/pic/:id`, [uploadFile.single("picture")], changePicture)
app.delete(`/:id`, deleteMenu)

export default app