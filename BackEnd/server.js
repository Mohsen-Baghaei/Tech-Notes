require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");

const cookeParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PROT || 3500;

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookeParser);

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require(path.join(__dirname, "routes", "root")));

app.use("/auth", require(path.join(__dirname, "routes", "authRoutes")));

app.use("/users", require(path.join(__dirname, "routes", "userRoutes")));

app.use("/notes", require("./routes/noteRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
//techNotesDB
