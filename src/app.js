const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { createClient } = require("yappy-node-back-sdk");
const passport = require("passport")
require("./strategies/JwtStrategy")
require("./strategies/LocalStrategy")
require("./authenticate");
const User = require("./models/User");

const app = express();

// settings
app.set("port", process.env.PORT || 4000);

// middlewares
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(fileUpload());
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static("upload"));
app.use(passport.initialize());
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(
  "/img/imgprofile",
  express.static(path.join(__dirname, path.join("upload", "img_profiles")))
);
app.use(
  "/img/imgpost",
  express.static(path.join(__dirname, path.join("upload", "img_posts")))
);

// routes
app.use("/api/posts", require("./routes/posts"));
app.use("/api/imgpost", require("./routes/imgpost"));
app.use("/api/imgprofile", require("./routes/imgprofile"));
app.use("/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));

module.exports = app;
