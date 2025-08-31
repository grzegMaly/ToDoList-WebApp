const express = require('express');
const morgan = require("morgan");
const path = require('path');
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const routes = require('./routes/routes');

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cookieParser());

const limiter = rateLimit({
    max: process.env.MAX_REQUEST_LIMIT,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from these IP, please try again in an hour",
});
app.use("/api", limiter);

app.use(express.json({limit: process.env.PACKET_RATE_LIMIT}));
app.use(express.urlencoded({extended: true, limit: process.env.PACKET_LIMIT_SIZE}));

app.use(routes);

//TODO: ADD GLOBAL EXCEPTION HANDLER

/**@type {import('express').Express}*/
module.exports = app;