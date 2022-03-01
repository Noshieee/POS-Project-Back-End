require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

const app = express();

app.use(express.json())
app.use(cors());

const productsRouter = require('./routes/productRoute')
const usersRouter = require('./routes/userRoute')
const cartRouter = require('./routes/cartRoute')

app.use('/products', productsRouter)
app.use('/users', usersRouter)
app.use('/cart', cartRouter)

app.listen(process.env.PORT||4200, () => console.log('Server Started'))