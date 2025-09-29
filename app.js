const express = require('express');
// const shopRouter = require("./router");
require("dotenv").config();
const authRouter = require("./router/userRouter");
const customerRouter = require("./router/customerRouter");
const adminRouter = require("./router/adminRouter");
const paystackRouter = require("./router/paystackRouter")
const mongoose = require("mongoose")
// const userModel = require("./schema/user");

// const authControlller = require("./router/authController");
const app = express();
const port = 3000;
app.use(express.json());

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/create", customerRouter);
app.use("/", customerRouter);
app.use("/", customerRouter);
app.use("/", customerRouter);
app.use("/", customerRouter);
app.use("/", customerRouter);
app.use("/", paystackRouter);





// connect to database
mongoose.connect(process.env.DB_url)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log("An error occurred while trying to connect::::", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
