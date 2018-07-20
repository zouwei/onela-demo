const jwt = require('jsonwebtoken');     // 使用jwt签名
const {UsersInfo, UsersAccount} = require("../models");

UsersInfo.getToken = (account) => {
    let self = this;
    // check app key & secret valid
    // generate token
    // set token to redis;
    return UsersAccount.getEntity({
        where: [{
            "logic": "and",
            "key": "account",
            "operator": "=",
            "value": account
        }],
        limit: [0, 1]
    }).then(client => {
        if (client.length == 0)
            return Promise.reject(new Error("未查询到相关用户信息"));
        //创建token
        let token = jwt.sign({"userId": client[0].userId}, "OrdZ80f1TwWlr5pSi1USiDGsfoIfKbpm", {
            expiresIn: 60 * 60 * 24    // 授权时效24小时
        });
        return Promise.resolve(token);
    });
}


module.exports = {UsersInfo};
