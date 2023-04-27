const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.router");

app.get("/", (req, res) => {
    res.status(200).send("Basic API Endpoint");
})

app.use("/users",userRouter);


app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Connected to MongoDB Atlas");
        console.log(`Server is running at http://localhost:${process.env.port}`);
    } catch (error) {
        console.log("Connection Failed");
        console.log(error.message);
    }
})