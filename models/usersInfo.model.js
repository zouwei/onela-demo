/**
 *
 */
module.exports = exports = function (OnelaBaseModel) {
    class UsersInfo extends OnelaBaseModel {
        // 可以在此自定义扩展方法（默认封装没有的方法）
    }

    // 【重要】单例模式，数据表配置
    UsersInfo.configs = {
        fields: [
            {"name": "userId", "type": "varchar", "default": null, "comment": "用户id", "primary": true},
            {"name": "password", "type": "varchar", "default": null, "comment": "登录密码"},
            {"name": "name", "type": "varchar", "default": null, "comment": "用户姓名"},
            {"name": "birthday", "type": "date", "default": null, "comment": "生日"},
            {"name": "sex", "type": "varchar", "default": null, "comment": "性别"},
            {"name": "education", "type": "varchar", "default": null, "comment": "教育"},
            {"name": "country", "type": "varchar", "default": null, "comment": "国家"},
            {"name": "province", "type": "varchar", "default": null, "comment": "省份"},
            {"name": "city", "type": "varchar", "default": null, "comment": "城市"},
            {"name": "address", "type": "varchar", "default": null, "comment": "地址"},
            {"name": "status", "type": "varchar", "default": null, "comment": "状态：启用、禁用"},
            {"name": "industry", "type": "varchar", "default": null, "comment": "行业"},
            {"name": "job", "type": "varchar", "default": null, "comment": "工作"},
            {"name": "createdAt", "type": "datetime", "default": null, "comment": "创建时间"},
            {"name": "updatedAt", "type": "datetime", "default": null, "comment": "修改时间"},
            {"name": "valid", "type": "tinyint", "default": "1", "comment": "是否有效：1有效、0无效"},
        ],
        tableName: "UsersInfo",
        engine: "default"
    };

    return UsersInfo;
};