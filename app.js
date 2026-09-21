const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const url = process.env.DB_URL;
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());
app.use(cors());
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
