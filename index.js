const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())

app.use(cors({credentials: true, origin: "http://localhost:3000"}))

app.use(express.static('public'))

const UserRouters = require('./routers/UserRouters')
app.use('/users', UserRouters)
app.use('/login', UserRouters)
app.use('/checkuser', UserRouters)

app.listen(5000)