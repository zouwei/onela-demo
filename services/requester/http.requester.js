const request = require("request");
const {logger, dLogger} = require("../../common/logger");

/**
 * 需要增加重试等机制
 */

class HttpRequester {
    static doRequest (host, args) {
        args.method = args.method || "get";
        let uri = host + args.url + args.querystring;
        // delete args.url;
        args.timeout = args.timeout || 1000 * 60 * 1; // 默认1分钟超时，允许请求自定义
        args.headers.host = host.replace("http://", ""); // reffer可能还需要带上
        delete args.headers['content-length'];
        return new Promise((resolve, reject) => {
            request(uri, args, function (err, res, body) {
                dLogger.debug("request to %s, with args {url: %s, method:%s, headers:%s}", uri, args.url, args.method, args.headers);
                if (err) {
                    logger.error("[%s] Failed, error=%s:%s", uri, err.name, err.message);
                    return reject(err);
                } else {
                    logger.info("[%s] return code=%s", uri, res.statusCode);
                    return resolve(res);
                }
            });
        });
    }
}

module.exports = {HttpRequester};
