import express from "express"
import { getAllOrders, createOrder, updateStatusOrder, deleteOrder } from "../controllers/orderController"
import { verifyAddOrder, verifyEditStatus } from "../middlewares/orderValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"

const app = express()
app.use(express.json())

app.get(`/get`, [verifyToken, verifyRole(["CASHIER","MANAGER"])], getAllOrders)
app.post(`/new`, [verifyToken, verifyRole(["CASHIER"]), verifyAddOrder], createOrder)
app.put(`/update/:id`, [verifyToken, verifyRole(["CASHIER"]), verifyEditStatus], updateStatusOrder)
app.delete(`/delete/:id`, [verifyToken, verifyRole(["MANAGER"])], deleteOrder)

export default app