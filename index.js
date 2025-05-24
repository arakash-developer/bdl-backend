const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Make sure to include this
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;

const userRoute = require("./routes/userRoute");
const groupRoute = require("./routes/groupRoute");
const seriesRoute = require("./routes/seriesRoute");
const subSeriesRoute = require("./routes/subSeriesRoute");
const productRoute = require("./routes/productRoute");
const specificationRoute = require("./routes/specificationRoute");
const recentWorkRoute = require("./routes/recentWorkRoute");
const mockupZoneRoute = require("./routes/mockupZoneRoute");
const profileRoute = require("./routes/profileRoute");
const contactRoute = require("./routes/contactRoute");
const academyRoute = require("./routes/academyRoute");
const bannerRoute = require("./routes/bannerRoute");
const greetingRoute = require("./routes/greetingRoute");
const homeRoute = require("./routes/homeRoute");
const serviceRoute = require("./routes/serviceRoute");
const customerRoute = require("./routes/customerRoute");

// Serve static files from the 'uploads/images' and 'uploads/videos' directories
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);
app.use(
  "/uploads/videos",
  express.static(path.join(__dirname, "uploads", "videos"))
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/api/v1/home", homeRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/groups", groupRoute);
app.use("/api/v1/series", seriesRoute);
app.use("/api/v1/sub-series", subSeriesRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/specifications", specificationRoute);
app.use("/api/v1/recent-works", recentWorkRoute);
app.use("/api/v1/mockup-zones", mockupZoneRoute);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/contacts", contactRoute);
app.use("/api/v1/academys", academyRoute);
app.use("/api/v1/banners", bannerRoute);
app.use("/api/v1/greeting", greetingRoute);
app.use("/api/v1/services", serviceRoute);
app.use("/api/v1/customers", customerRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err + "MongoDB connection failed"));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

module.exports = app;
