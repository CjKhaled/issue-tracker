// Entry point
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRouter = require('./routes/authRoutes')

app.use("/", authRouter)

app.listen(3000, () => console.log("server listening on port 3000!"));
