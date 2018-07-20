"use strict";

const config = require("config");
const {Onela, OnelaBaseModel} = require("onela");
const dbConfig = config.get("global.dbConfig");
// 解决nodejs require module时循环引用会导致undefined的问题
const Apps = require('./apps.model.js');
const AppsUsers = require('./appsUsers.model.js');
const UsersInfo = require('./usersInfo.model');
const UsersAccount = require('./usersAccount.model');

// 初始化Onela模块
Onela.init(dbConfig);

let db = {
    "Apps": Apps(OnelaBaseModel),
    "AppsUsers": AppsUsers(OnelaBaseModel),
    "UsersInfo": UsersInfo(OnelaBaseModel),
    "UsersAccount": UsersAccount(OnelaBaseModel)
};

module.exports = db;
