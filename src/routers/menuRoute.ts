import express from "express";
import { getAllMenus, updateMenu, createMenu, deleteMenu } from "../controllers/menuController";
import { verifyAddMenu, verifyEditMenu } from "../middlewares/verifyMenu";

const app = express()
app.use(express.json())

app.get(`/`, getAllMenus)
app.post(`/`, [verifyAddMenu], createMenu)
app.put(`/:id`, [verifyEditMenu], updateMenu)
app.delete(`/:id`, deleteMenu)

export default app