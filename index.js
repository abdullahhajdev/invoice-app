const express = require("express");
require("dotenv").config();
const authRoutes = require("./auth/authRoutes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
