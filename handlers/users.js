
const {logger} = require("../common/logger");
const {UsersAccount, UsersInfo} = require("../modelservices");
const {BaseViewSet} = require("./bases/viewset");

class ClientViewSet extends BaseViewSet {
    static removeAction (entity_id) {
        return APIPermission.destroy({where: {config_id: entity_id}});
    }

    static create (req, res) {
        var self = this;
        var entity_info = req.body;
        entity_info.app_secret = APIClient.generateSecret();
        console.log('entity_info',entity_info)
        return APIClient.insertEntity(entity_info).then((entity) => {
            self.createAction(entity).then(() => {
                res.status(201).json({code: 0, data: {entity: entity}, message: ""});
            });
        }).catch((e) => {
            console.log('异常',e)
            logger.error("create %s entity FAILED, info=%j, e=%s: %s", this.model.name, entity_info, e.name, e.message);
            if (e.name == "SequelizeUniqueConstraintError") {
                return res.status(400).json({code: 1, message: "ID不能重复"});
            } else if (e.name == "SequelizeDatabaseError") {
                return res.status(500).json({code: 1, message: "创建数据失败"});
            } else {
                return res.status(500).json({code: 1, message: "创建数据失败"});
            }
        });
    }
}

ClientViewSet.identity_name = "app_key";
ClientViewSet.model = UsersAccount;

module.exports = {
    list: ClientViewSet.list.bind(ClientViewSet),
    create: ClientViewSet.create.bind(ClientViewSet),
    update: ClientViewSet.update.bind(ClientViewSet),
    remove: ClientViewSet.remove.bind(ClientViewSet),
    detail: ClientViewSet.detail.bind(ClientViewSet)
};
