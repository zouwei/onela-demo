
const {UnauthorizedError} = require("../../common/error");
const {APIClient} = require("../../modelservices/client.service");

module.exports.authenticate = function (req, res, next) {
    let token = req.headers['authorization'];

    return APIClient.getAppByToken(token).then((app) => {
        req.app_key = app.app_key;
        next();
    }).catch(e => {
        let message = "不允许访问";
        if (e instanceof UnauthorizedError) {
            message = e.message;
        }
        res.status(401).json({code: 1, message: message});
    });
};
