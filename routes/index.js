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

const {testPost, ping, testGetWithqs} = require("../handlers/index");
// app.get("/test", testGetWithqs);
// app.post("/test", testPost);
app.get("/ws_sso/", ping);

app.use("/ws_sso/apps/", require("./apps"));
app.use("/ws_sso/users/", require("./users"));
app.use("/ws_sso/tokens/", require("./tokens"));
// 测试travis  

module.exports = exports = app;
