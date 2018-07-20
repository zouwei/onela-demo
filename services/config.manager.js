const regexp = require("path-to-regexp");
const _ = require("lodash");
const {dLogger} = require("../common/logger");
const { APIConfig, APIPermission } = require("../modelservices");

// TODO: URL的匹配算法，可以使用路由树的机制（减少无意义的线性匹配）
// 20180117 考虑了一下，我觉得在几千的体量下都不是问题
// TODO: 按method将config分类成不同的组，优化搜索效率
class ConfigManager {
    static loadConfig () {
        if (this._config_list !== undefined && this._config_list.length != 0) {
            return Promise.resolve(this._config_list);
        } else {
            var self = this;
            return APIConfig.getEntity({}).then(query_config_list => {
                self._config_list = query_config_list;
                dLogger.debug("loaded %s configs", query_config_list.length);
                return self.bindPerms().then(() => {
                    return Promise.resolve(self._config_list);
                });
            });
        }
    }

    static matchUrl (method, url) {
        var self = this;
        return this.loadConfig().then(() => {
            for (let cfg of self._config_list) {

                if (cfg.method.toLowerCase() !== method.toLowerCase()) {
                    continue;
                }
                let pattern = regexp(cfg.url_pattern);
                let result = pattern.exec(url);
                if (result) {
                    dLogger.debug("request %s [%s] passed with pattern %s, detail=%j", url, method, cfg.url_pattern, cfg);
                    return Promise.resolve(cfg);
                } else {
                    continue;
                }
            }
            return Promise.resolve(null);
        });
    }

    static checkPerms (cfg, app_key) {
        let perm_string = cfg.perms_dict[app_key];
        if (perm_string) { // 可能会有不同的字母来标识不同的权限
            return true;
        }
        return false;
    }

    static updateConfig (id, config) {
        var self = this;
        let update_key_list = ['request_list', 'method', 'url_pattern', 'prioity'];
        return this.loadConfig().then(() => {
            for (let cfg of this._config_list) {
                if (cfg.id == id) {
                    for (let update_key of update_key_list) {
                        if (update_key in config) {
                            cfg[update_key] = config[update_key];
                        }
                    }
                }
            }
            self._config_list.sort((a, b) => { return a.prioity < b.prioity; });
            return Promise.resolve(true);
        });
    }

    static deleteConfig (id) {
        var self = this;
        return this.loadConfig().then(() => {
            _.remove(self._config_list, (config) => (config.id == id));
            return Promise.resolve(true);
        });
    }

    static insertConfig (config) {
        var self = this;
        return this.loadConfig().then(() => {
            _.remove(self._config_list, (existedConfig) => (existedConfig.id == config.id));
            config.perms_dict = {};
            self._config_list.push(config);
            self._config_list.sort((a, b) => { return a.prioity < b.prioity; });
            return Promise.resolve(true);
        });
    }

    static bindPerms () {
        var self = this;
        return APIPermission.getEntity({}).then((perms_list) => {
            let perms_dict = {};
            perms_list.forEach(perms => {
                if (!(perms.config_id in perms_dict)) {
                    perms_dict[perms.config_id] = {};
                }
                perms_dict[perms.config_id][perms.app_key] = perms.perm_string;
            });

            self._config_list.forEach(config => {
                config.perms_dict = perms_dict[config.id] || {};
            });
            dLogger.debug("bind perms to config done");
            return Promise.resolve(true);
        });
    }

    /**
     * 将修改的权限批量的应用到内存中去
     * @param {Object} diff_obj {
     *      deleted_list: [],
            changed_list: [],
            added_list: []
        }
     */
    static bulkUpdatePerms (diff_obj) {
        var self = this;

        if (diff_obj.added_list.length == 0 && diff_obj.changed_list.length == 0 && diff_obj.deleted_list.length == 0) {
            return Promise.resolve(true);
        }

        var update_dict = {};
        var deleted_dict = {};
        for (let added of diff_obj.added_list) {
            if (!(added.config_id in update_dict)) {
                update_dict[added.config_id] = {};
            }
            update_dict[added.config_id][added.app_key] = added.perm_string;
        }

        for (let changed of diff_obj.changed_list) {
            if (!(changed.config_id in update_dict)) {
                update_dict[changed.config_id] = {};
            }
            update_dict[changed.config_id][changed.app_key] = changed.perm_string;
        }

        for (let deleted of diff_obj.deleted_list) {
            deleted_dict[deleted.config_id] = {[deleted.app_key]: 1};
        }

        return this.loadConfig().then(() => {
            self._config_list.forEach(config => {
                if (config.id in update_dict) {
                    let temp_update_info = update_dict[config.id];
                    for (let app_key in temp_update_info) {
                        config.perms_dict[app_key] = temp_update_info[app_key];
                    }
                }
                if (config.id in deleted_dict) {
                    for (let app_key in deleted_dict[config.id]) {
                        delete config.perms_dict[app_key];
                    }
                }
            });
            return Promise.resolve(true);
        });
    }

    static removePerms (config_id, app_key) {
        var self = this;
        return this.loadConfig().then(() => {
            self._config_list.forEach(config => {
                if (config.id === config_id) {
                    delete config.perms_dict[app_key];
                }
            });
            return Promise.resolve(true);
        });
    }

    static updatePerms (config_id, app_key, perm_string) {
        var self = this;
        return this.loadConfig().then(() => {
            self._config_list.forEach(config => {
                if (config.id === config_id) {
                    config.perms_dict[app_key] = perm_string;
                }
            });
            return Promise.resolve(true);
        });
    }
}

ConfigManager._config_list = [];

module.exports = { ConfigManager };
