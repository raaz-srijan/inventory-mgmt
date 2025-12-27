const express = require("express");

const app = express();
app.use(express.json());

require("dotenv").config();

const PORT = process.env.PORT || 7000
const connectDb = require("./config/connectDb");
const cloudinaryConnect = require("./config/cloudinaryConnect");

const businessRoute = require("./routes/businessRoute");

app.use("/api/business", businessRoute);

app.listen(PORT, ()=> {
    console.log(`Server started on ${PORT}`);
    connectDb();
    cloudinaryConnect();
});