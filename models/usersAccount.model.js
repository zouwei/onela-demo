/**
 *
 */
module.exports = exports = function (OnelaBaseModel) {
    class UsersAccount extends OnelaBaseModel {
        // 可以在此自定义扩展方法（默认封装没有的方法）
    }

    // 【重要】单例模式，数据表配置
    UsersAccount.configs = {
        fields: [
            {"name": "accountId", "type": "varchar", "default": null, "comment": "账户id", "primary": true},
            {"name": "account", "type": "varchar", "default": null, "comment": "账户"},
            {"name": "type", "type": "varchar", "default": null, "comment": "账户类型：手机、账户、微信、邮箱、微博、支付宝"},
            {"name": "userId", "type": "varchar", "default": null, "comment": "用户id"},
            {"name": "unionid", "type": "varchar", "default": null, "comment": "unionid"},
            {"name": "openid", "type": "varchar", "default": null, "comment": "openid"},
            {"name": "createdAt", "type": "datetime", "default": null, "comment": "创建时间"},
            {"name": "updatedAt", "type": "datetime", "default": null, "comment": "修改时间"},
            {"name": "valid", "type": "tinyint", "default": "1", "comment": "是否有效：1有效、0无效"},
        ],
        tableName: "UsersAccount",
        engine: "default"
    };

    return UsersAccount;
};