const jwt = require('jsonwebtoken');     // 使用jwt签名
const {logger} = require("../../common/logger");

function checkInnerUser(req, res) {
    // 获取token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // 解码 token (验证 secret 和检查有效期（exp）)
        let decoded = jwt.verify(token, "OrdZ80f1TwWlr5pSi1USiDGsfoIfKbpm");
        // console.log("decoded", decoded.userId);
        if (!decoded) {
            return Promise.reject(new Error("无效的token"));
        } else {
            // 如果验证通过，在req中写入解密结果
            req.decoded = decoded;
            console.log("decoded", decoded.userId);
            return Promise.resolve({"userId": decoded.userId})
        }
    } else {
        // 没有拿到token 返回错误
        return Promise.reject(new Error("invalid-token"));
    }
};

module.exports.checkManageAuth = function (req, res, next) {
    return checkInnerUser(req, res).then(result => {
        req.userInfo = result;
        return next();
    }).catch(e => {
        logger.error("%s request authenticate failed, reason=%s: %s", req.originalUrl, e.name, e.message);
        res.status(401).json({code: 401, msg: "不允许访问"});
    });
};
