const express = require("express");
// const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser');

var app = express();

/**
 * 这里只配置URL，不写具体的函数
 */
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(bodyParser.json({type: "application/*+json"}));
// app.use(bodyParser.text());
// app.use(bodyParser.urlencoded({extended: false}));

// const {testPost, ping, testGetWithqs} = require("../handlers/index");
// app.get("/test", testGetWithqs);
// app.post("/test", testPost);
// app.get("/", ping);

app.use("/apps/", require("./apps"));
app.use("/users/", require("./users"));
app.use("/tokens/", require("./tokens"));

module.exports = exports = app;
