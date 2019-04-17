'use strict'
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const https = require('https');
const http = require('http');
require('dotenv').config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(compression());

app.use(function (req, res, next) {
    var allowedOrigins = [
        "http://127.0.0.1:3000",
    ];

    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,Content-Type,X-Auth-Token"
    );
    res.setHeader('Access-Control-Allow-Origin','*');

    res.setHeader("Access-Control-Allow-Credentials", true);

    if ("OPTIONS" == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

var socketController = require('./router/socket');

app.use('/ws', socketController);
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") == "development" ? err : {};
    console.error("Error handler : ", err);
    return res.status(err.status || 500).send(err);
});

let server;
if (process.env.SERVER == 'LOCAL') {
    server = https.createServer(app);
} else {
    server = http.createServer(app);
    console.log('APP to serve http requests.')
}

var socket = require('./controller/socket');
(async () => {
    try {
        await socket.socketobject(server)
        console.log("Socket connected")
    } catch (ex) {
        console.error("Could not able to connect socket server", ex)
    }
})();

server.listen(process.env.PORT || 3000);