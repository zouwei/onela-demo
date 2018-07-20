const {UsersInfo} = require("../modelservices");

// module.exports.AppToken = function (req, res) {
//     var request_info = req.body;
//     return AppToken.getToken(request_info.app_key, request_info.app_secret).then(token => {
//         res.json({token: token});
//     }).catch(ex => {
//         res.json({"error": ex.message});
//     });
// };

/**
 * 获取token
 * @param req
 * @param res
 * @return {Promise.<TResult>}
 */
module.exports.getToken = function (req, res) {
    var body = req.body;
    // 登录名
    // 登录账户 request_info.app_key, request_info.app_secret


    return UsersInfo.getToken(body.account).then(token => {
        res.json({token: token});
    }).catch(ex => {
        res.json({"error": ex.message});
    });
};




module.exports.refreshToken = function (req, res) {
    throw new Error("not implement yet");
};
