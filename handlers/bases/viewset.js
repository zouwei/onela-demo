const {logger} = require("../../common/logger");

class BaseViewSet {
    static listAction(entity_list) {
        return Promise.resolve(entity_list);
    }

    // 查询参数
    static getQueryArgs(req) {
        // 定义参数
        let p = [];
        // 不同的模型会有不同的查询逻辑
        let body = req.query;
        // get传值json对象需要进行JSON转换
        body.where = JSON.parse(body.where||"[]");

        // 精确匹配查询
        for (let i in body.where) {
            if (body.where[i] != "") {
                p.push({"key": i, "value": body.where[i], "logic": "and", operator: "="});
            }
        }

        return Promise.resolve(p);
    }

    static list(req, res) {
        let self = this;
        let default_limit = 20;
        let default_index = 1;
        let limit = parseInt(req.query.page) || default_limit;
        let offset = parseInt(req.query.index) || default_index;
        offset = offset < 1 ? 1 : offset;
        console.log((offset - 1) * limit, limit)
        return this.getQueryArgs(req).then(query_args => {
            console.log('查询条件',query_args)
            return self.model.getEntityList({
                where: query_args,
                limit: [(offset - 1) * limit, limit]

            }).then(query_result => {
                console.log('返回数据', JSON.stringify(query_result));
                self.listAction(query_result.data).then(() => {
                    res.json({code: 0, data: {entity_list: query_result.data, total: query_result.recordsTotal[0].total}});
                });
            });
        }).catch((e) => {
            console.log(e)
            logger.error("get %s failed, e=%s: %s", self.model.name, e.name, e.message);
            res.status(500).json({code: 1, message: "获取失败"});
        });
    }

    static detailAction(entity) {
        return Promise.resolve(entity);
    }

    static detail(req, res) {
        let self = this;
        let entity_id = req.params.id;
        return this.model.getEntity({
            where: {"logic": "and", "key": self.identity_name, "operator": "=", "value": entity_id}
        }).then(entity => {
            if (!entity) {
                res.status(404).json({code: 1, message: "不存在该数据"});
            } else {
                self.detailAction(entity).then(() => {
                    res.json({code: 0, message: "", data: {entity}});
                });
            }
        }).catch((e) => {
            logger.error("get %s with %s failed, e=%s: %s", self.model.name, entity_id, e.name, e.message);
            res.status(500).json({code: 1, message: "获取单条数据失败"});
        });
    }

    static removeAction(entity_id) {
        return Promise.resolve(entity_id);
    }

    static remove(req, res) {
        var self = this;
        let entity_id = parseInt(req.params.id);
        return this.model.deleteEntity({
            where: [{"logic": "and", "key": self.identity_name, "operator": "=", "value": entity_id}]    //{[self.identity_name]: entity_id}
        }).then(entity => {
            self.removeAction(entity_id).then(() => {
                res.status(204).json({code: 0, message: "", data: {[self.identity_name]: entity_id}});
            });
        }).catch((e) => {
            logger.error("delete %s with %s failed, e=%s: %s", self.model.name, entity_id, e.name, e.message);
            res.status(500).json({code: 1, message: "删除单条数据失败"});
        });
    }

    static updateAction(entity_id, entity_info) {
        return Promise.resolve(entity_id);
    }

    static update(req, res) {
        let self = this;
        let entity_id = parseInt(req.params.id);
        let entity_info = req.body;
        // 更新参数
        let entity_update = [];
        for (let i in entity_info) {
            entity_update.push({key: i, value: entity_info[i], operator: "replace"});
        }
        // 更新需要改下
        return this.model.updateEntity({
            update: entity_info,
            where: [{"logic": "and", "key": self.identity_name, "operator": "=", "value": entity_id}]
        }).then(() => {
            self.updateAction(entity_id, entity_info).then(() => {
                res.status(203).json({code: 0, message: "", data: {[self.identity_name]: entity_id}});
            });
        }).catch((e) => {
            logger.error("update %s with %s, %j failed, e=%s: %s", self.model.name, entity_id, entity_info, e.name, e.message);
            res.status(500).json({code: 1, message: "修改单条数据失败"});
        });
    }

    static createAction(entity) {
        return Promise.resolve(entity);
    }

    /**
     * 新增
     * @param req
     * @param res
     * @returns {Promise.<TResult>}
     */
    static create(req, res) {
        let self = this;
        let entity_info = req.body;
        return this.model.insertEntity(entity_info).then((entity) => {
            self.createAction(entity).then(() => {
                res.status(201).json({code: 0, data: {entity: entity}, message: ""});
            });
        }).catch((e) => {
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

BaseViewSet.identity_name = "id";
BaseViewSet.model = null;

module.exports = {BaseViewSet};
