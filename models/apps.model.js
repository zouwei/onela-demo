/**
 *
 */
module.exports = exports = function (OnelaBaseModel) {
    class Apps extends OnelaBaseModel {
        // 可以在此自定义扩展方法（默认封装没有的方法）
    }

    // 【重要】单例模式，数据表配置
    Apps.configs = {
        fields: [
            {"name": "appId", "type": "varchar", "default": null, "comment": "应用标识", "primary": true},
            {"name": "appName", "type": "varchar", "default": null, "comment": "应用名称"},
            {"name": "appURL", "type": "varchar", "default": null, "comment": "单点登录链接"},
            {"name": "appDepart", "type": "varchar", "default": null, "comment": "所属部门"},
            {"name": "appDescription", "type": "varchar", "default": null, "comment": "描述"},
            {"name": "appMainURL", "type": "varchar", "default": null, "comment": "系统主页或者登录页面"},
            {"name": "status", "type": "varchar", "default": null, "comment": "状态：启用、禁用"},
            {"name": "createdAt", "type": "datetime", "default": null, "comment": "创建时间"},
            {"name": "updatedAt", "type": "datetime", "default": null, "comment": "修改时间"},
            {"name": "valid", "type": "tinyint", "default": "1", "comment": "是否有效：1有效、0无效"},
        ],
        tableName: "Apps",
        engine: "default"
    };

    return Apps;
};