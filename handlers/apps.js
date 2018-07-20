const {logger, dLogger} = require("../common/logger");
const { Apps } = require("../modelservices");
const {BaseViewSet} = require("./bases/viewset");

class AppsViewSet extends BaseViewSet {
    // static update (req, res) {
    //     var self = this;
    //     var entity_id = parseInt(req.params.id);
    //     var entity_info = req.body;
    //     return this.model.findOne({
    //         where: {id: entity_id}
    //     }).then(perms => {
    //         if (perms) {
    //             return Promise.all([
    //                 self.model.update(entity_info, {where: {id: entity_id}}),
    //                 ConfigManager.updatePerms(perms.config_id, perms.app_key, perms.perm_string)
    //             ]).then(() => {
    //                 return res.json({id: entity_id});
    //             });
    //         } else {
    //             // 找不到对应的ID，重新创建一个
    //             return self.create(req, res);
    //         }
    //     }).catch((e) => {
    //         logger.error("update perms failed, e=%s: %s", e.name, e.message);
    //         res.status(500).json({code: 1, message: "修改权限失败"});
    //     });
    // }
    //
    // static createAction (entity) {
    //     return ConfigManager.updatePerms(entity.config_id, entity.app_key, entity.perm_string);
    // }
    //
    // static remove (req, res) {
    //     var self = this;
    //     let entity_id = parseInt(req.params.id);
    //     return this.model.findOne({
    //         where: {id: entity_id}
    //     }).then(entity => {
    //         if (!entity) {
    //             return res.status(204).json({id: entity_id});
    //         }
    //         return Promise.all([
    //             ConfigManager.removePerms(entity.app_key, entity.config_id),
    //             self.model.destroy({where: {id: entity_id}})
    //         ]).then(() => {
    //             res.status(204).json({id: entity_id});
    //         });
    //     }).catch((e) => {
    //         logger.error("remove perms failed, e=%s: %s", e.name, e.message);
    //         res.status(500).json({code: 1, message: "移除权限失败"});
    //     });
    // }
}

AppsViewSet.model = Apps;

/**
 *
 * configs/1/perms/ GET 获取列表
 * configs/1/perms/ POST 创建（更新）
 */
class CommonPermViewSet {
    // static list (req, res) {
    //     var object_id = req.params.id;
    //     return Apps.findAll({
    //         where: {[this.url_id_name]: object_id}
    //     }).then(perms_list => {
    //         res.json({code: 0, data: {entity_list: perms_list}});
    //     });
    // }
    //
    // static submit (req, res) {
    //     var self = this;
    //     var object_id = req.params.id;
    //     var perms_info_list = req.body;
    //     let update_list = [];
    //     perms_info_list.forEach(perms_info => {
    //         update_list.push({
    //             [self.url_id_name]: object_id,
    //             [self.update_id_name]: perms_info[self.update_id_name],
    //             perm_string: perms_info.perm_string || 'A'
    //         });
    //     });
    //
    //     dLogger.debug("user submmit perms: %j", update_list);
    //     return Apps.updatePerms({[this.url_id_name]: object_id}, update_list).then(update_result => {
    //         logger.info("submit permissions, total updated: %j", update_result.update_summary);
    //         let diff_obj = update_result.diff_obj;
    //         if (diff_obj.added_list.length == 0 && diff_obj.changed_list.length == 0 && diff_obj.deleted_list.length == 0) {
    //             return res.status(201).json({code: 0, data: {update_summary: update_result.update_summary}});
    //         } else {
    //             return ConfigManager.bulkUpdatePerms(diff_obj).then(result => {
    //                 return res.status(201).json({code: 0, data: {update_summary: update_result.update_summary}});
    //             }).catch(e => {
    //                 logger.error("update perms to memory failed: %s: %s", e.name, e.message);
    //                 return res.status(201).json({code: 0, data: {update_summary: update_result.update_summary}});
    //             });
    //         }
    //     });
    // }
}

/**
 * clients/:id/perms/ GET 获取当前客户端配置的权限列表
 * clients/:id/perms/ POST 提交当前客户端的配置权限
 */
class ClientPermViewSet extends CommonPermViewSet {}

ClientPermViewSet.url_id_name = "app_key"; // 放在url里的id
ClientPermViewSet.update_id_name = "config_id";

/**
 * configs/:id/perms/ GET 获取当前路由配置的权限列表
 * configs/:id/perms/ POST 提交当前路由配置的权限
 */
class ConfigPermViewSet extends CommonPermViewSet {}

ConfigPermViewSet.url_id_name = "config_id";
ConfigPermViewSet.update_id_name = "app_key";

module.exports = {
    list: AppsViewSet.list.bind(AppsViewSet),
    create: AppsViewSet.create.bind(AppsViewSet),
    update: AppsViewSet.update.bind(AppsViewSet),
    remove: AppsViewSet.remove.bind(AppsViewSet),
    detail: AppsViewSet.detail.bind(AppsViewSet)

    // configPermList: ConfigPermViewSet.list.bind(ConfigPermViewSet),
    // configPermUpdate: ConfigPermViewSet.submit.bind(ConfigPermViewSet),
    // clientPermList: ClientPermViewSet.list.bind(ClientPermViewSet),
    // clientPermUpdate: ClientPermViewSet.submit.bind(ClientPermViewSet)
};
