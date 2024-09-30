import express from 'express'
import cors from 'cors'
import MenuRoute from './routers/menuRoute'

const port: number = 4000
const app = express()
app.use(cors())

app.use(`/menu`, MenuRoute)

app.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`)
})