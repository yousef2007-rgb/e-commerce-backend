const express = require("express");
const app = express();
const mongoose = require("mongoose");
const signin = require("./routes/signin.js");
const signup = require("./routes/signup.js");
const products = require("./routes/products.js");
const categories = require("./routes/categories.js");
const errorHandler = require("./middleware/errorHandler.js");
const cors = require("cors")

app.use(express.json());
app.use(cors()); 
app.use("/signin", signin);
app.use("/signup", signup);
app.use("/products", products);
app.use("/categories", categories);
app.use(express.static("uploads"))

app.use(errorHandler);

require("dotenv").config();
mongoose
  .connect("mongodb://localhost:27017/baby")
  .then(() => console.log("connected"))
  .catch((err) => console.log(`error: ${err}`));

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`),
);
