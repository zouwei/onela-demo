# onela-demo（SSO单点登录系统）
> 非正式版本，还在开发中……
> onela项目架构演示项目 - 基于onela快速搭建项目架构


## 第一步：克隆onela-tools项目
~~~~~~js
git clone https://github.com/zouwei/onela-tools
~~~~~~
## 第二步：配置访问数据库
~~~~~~js
// 在tests目录下找到你数据库对应的文件，例如你的数据库是mysql，那么对应的文件是mysql.js
// 你需要修改mysql.js中数据库配置信息，确保能正确访问你的数据库
 
/**
 * MYSQL工具方法实例
 * 数据库配置，可以初始化多个数据库实例
 */
let dbconfig = [{
    "engine": "default",    // 数据库实例名称
    "type": "mysql",        // 数据库类型
    "value": {
        "connectionLimit": 5,           // 连接池大小
        "host": "127.0.0.1",            // 数据库地址
        "user": "test",                 // 访问数据库用户名
        "password": "+passwordDryLmhG66BZHbtc=",    // 访问数据库密码
        "database": "test_db"           // 数据库名称
    }
}];
//onela模块新版本（2.0.0及以上）
const {Onela, OnelaBaseModel} = require("onela");
// 初始化Onela模块
Onela.init(dbconfig);
//onela-tools模块
const {OnelaTools} = require("../index");
const fs = require('fs');
const path = require("path");


// 已经在OnelaBaseModel封装的常用方法，可以在此基础自行扩展
class ToDoManager extends OnelaBaseModel {

    /**
     * onela 2.0 自动化构建实体模型方法
     * @returns {Promise.<TResult>}
     */
    static initModelsConfigFile(){
        let paras = {
            "path": "../dist/",            //输出文件路径，指向到目录即可，结尾“/”
            //可选参数，否则会填写默认值【用来描述注释】
            "databaseMapName": "oisInstanceConfig",
            "author": "joey"
        };

        let tools = new OnelaTools(ToDoManager, dbconfig[0]);
        // 输出路径

        // 生成初始化文件配置
        return tools.initModelsConfigFile(paras)
            .then((data) => {
                return Promise.resolve(data);
            }).catch((ex) => {
                return Promise.reject(ex);
            });
    }
}

// 【重要】单例模式，数据表配置
ToDoManager.configs = {
    fields: [
        // 表字段配置可以为空
    ],
    tableName: "",     //表明也可以为空
    engine: "default"
};

// 生成实体模型文件
ToDoManager.initModelsConfigFile().then(console.log).catch(console.log);

~~~~~~

## 第三步：执行mysql.js文件
node直接执行 Run 'mysql.js'文件
initModelsConfigFile():方法是生成对象模型代码，会变遍历整个数据库，将全部的数据表映射成为单独的js文件，默认生成好的文件在dist目录中，你也可以更改第二步中path映射的目录，放到指定的目录中去。
### 代码迁移
对于已经生成好的map model文件，直接复制移动至正式项目的指定目录中就可以了
onela-demo项目把数据表映射文件放到了models目录中，并在表命名的js文件末尾修改了文件命名"表名.model.js"