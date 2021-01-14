const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");

const users = require('./routes/api/users');
const jobs = require('./routes/api/jobs');
const applicant = require('./routes/api/applicant');

const app = express();

// BodyParser MiddleWare
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MONGODB
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MONGODB Connected..."))
	.catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
app.use("/api/jobs", jobs);
app.use("/api/applicant", applicant);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on ${port}`));