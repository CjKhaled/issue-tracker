// Entry point
require('dotenv').config()
const express = require("express");
const app = express();
const passport = require('passport')
const cookieParser = require('cookie-parser')
const errorHandler = require("./middleware/errorHandler")

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./config/passportConfig')(passport)

const authRouter = require('./routes/authRoutes')
const projectRouter = require('./routes/projectRoutes')
const issueRouter = require('./routes/issueRoutes')

app.use("/", authRouter)
app.use("/", projectRouter)
app.use("/projects/:projectId", issueRouter)

app.use(errorHandler)

const port = process.env.PORT || 3000
app.listen(port, "0.0.0.0", () => console.log(`server listening on port ${port}!`));
