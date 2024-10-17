import express from "express";
import { getAllProduk, newProduk } from "../Controllers/produkController";

const app = express()
app.use(express.json())

app.get(`/search`, getAllProduk)
// app.post(`/add`, newProduk)

export default app