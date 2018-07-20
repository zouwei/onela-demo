/**
 *
 */
module.exports = exports = function (OnelaBaseModel) {
    class AppsUsers extends OnelaBaseModel {
        // 可以在此自定义扩展方法（默认封装没有的方法）
    }

    // 【重要】单例模式，数据表配置
    AppsUsers.configs = {
        fields: [
            {"name": "appUserId", "type": "int", "default": null, "comment": "序号", "primary": true, "increment": true},
            {"name": "appId", "type": "varchar", "default": null, "comment": "应用系统标识"},
            {"name": "userId", "type": "varchar", "default": null, "comment": "单点登录帐号ID"},
            {"name": "appKey", "type": "varchar", "default": null, "comment": "应用系统登录帐号"},
            {"name": "appSecret", "type": "varchar", "default": null, "comment": "应用程序Secret"},
        ],
        tableName: "AppsUsers",
        engine: "default"
    };

    return AppsUsers;
};