const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGOOSE_URL).then(() =>{
    console.log('Connected to MongoDB')
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err)
})

app.use('/api/auth', authRoutes);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});