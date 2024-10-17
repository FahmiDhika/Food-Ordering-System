import express from "express";
import { newAdmin } from "../Controllers/adminController";

const app = express()
app.use(express.json())

// app.post(`create`, newAdmin)

export default app