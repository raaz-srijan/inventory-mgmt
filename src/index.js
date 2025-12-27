const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();

const PORT = process.env.PORT || 7000
const connectDb = require("./config/connectDb");
const cloudinaryConnect = require("./config/cloudinaryConnect");

const authRoute = require("./routes/authRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const messageRoute = require("./routes/messageRoute");
const postRoute = require("./routes/postRoute");
const staffRoute = require("./routes/staffRoute");

const businessRoute = require("./routes/businessRoute");
const roleRoute = require("./routes/roleRoute");
const permissionRoute = require("./routes/permissionRoute");
const activityRoute =  require("./routes/activityRoute");

app.use("/api/auth", authRoute);
app.use("/api/business", businessRoute);
app.use("/api/business/:businessId/inventory", inventoryRoute);
app.use("/api/staff", staffRoute);
app.use("/api/messages", messageRoute);
app.use("/api/posts", postRoute);
app.use("/api/logs", activityRoute);
app.use("/api/roles", roleRoute);
app.use("/api/permissions", permissionRoute);


app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
    connectDb();
    cloudinaryConnect();
});