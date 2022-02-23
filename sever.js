require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const productsRouter = require('./routes/productRoute')
app.use('/products', productsRouter)

app.listen(process.env.PORT||4200, () => console.log('Server Started'))