
// 用于流控，流控的配置应该是单独的。
// 重新考虑一下配置，就是路由的配置与基于路由的配置
// 流控与app与url均是多对多的关系。

module.exports.trafficMonitor = function (req, res, next) {
    next();
};
