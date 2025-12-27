const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();

const PORT = process.env.PORT || 7000
const connectDb = require("./config/connectDb");
const cloudinaryConnect = require("./config/cloudinaryConnect");


const businessRoute = require("./routes/businessRoute");
const roleRoute = require("./routes/roleRoute");
const permissionRoute = require("./routes/permissionRoute");

app.use("/api/business", businessRoute);
app.use("/api/roles", roleRoute);
app.use("/api/permissions", permissionRoute);


app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
    connectDb();
    cloudinaryConnect();
});