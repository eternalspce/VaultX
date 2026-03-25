
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running"));

// server.js
app.use("/auth", require("./routes/auth"));
app.use("/vault", require("./routes/vault"));