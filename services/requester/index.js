const {HttpRequester} = require("./http.requester");

/**
 * 基于权重的随机取值
 * @param {Array<Object>} host_list
 */
function weightBasedScheduler (host_list) {
    let total_weight = 0;
    for (let host of host_list) {
        total_weight += host.weight * 100; // 因为取整有去精度，这比较重要，下面的乘法也是一样
    }
    let t = Math.random();
    let random_value = parseInt(t * total_weight);
    for (let host of host_list) {
        random_value -= host.weight * 100;
        if (random_value <= 0) {
            return host;
        } else {
            continue;
        }
    }
}

class RequesterManager {
    static getHost (host_list) {
        let valid_host_list = host_list.filter(host => !host.is_down);
        if (valid_host_list.length == 1) {
            return valid_host_list[0];
        } else if (valid_host_list.length == 0) {
            throw new Error("no host available");
        } else {
            let host = weightBasedScheduler(valid_host_list);
            if (!host) {
                return valid_host_list[0];
            }
            return host;
        }
    }

    static getRequester (request_type) {
        console.log('request_type',request_type)
        let requester = this.requesterMapping[request_type];
        if (!requester) {
            throw new Error("invalid request type");
        }
        return requester;
    }

    static doRequest (req, request_list) {
        var self = this;
        let p_list = [];
        // TODO: 可能会有并行、线性的请求需求，可以使用二维数组来支持[[a,b], c, d]，这表示[a,b]跟c、d是并行的，a->b是线性的

        let options = {
            headers: req.headers,
            body: req,
            querystring: req.url.replace(req.path, "") // querystring
        };
        // host, ip等信息是否需要修改到远程的，以方便对方的服务器修改
        // body是直接从req.read()里读取的，如果有多个请求，是否会造成问题呢？试下就知道了。
        delete options.headers['authorization']; // 删除这里的token校验

        for (var request of request_list) {
            let requester = this.getRequester(request.request_type);
            let host = this.getHost(request.host_list);
            let temp_options = Object.assign({}, request.args, options);
            p_list.push(requester.doRequest(host.host, temp_options));
        }
        return Promise.all(p_list).then(self.mergeResult);
    }

    static mergeResult (response_list) {
        if (response_list.length == 1) {
            return response_list[0];
        } else {
            // 合并结果，需要根据结果类型来合并
            /**
             * 几个问题：
             * 1. 不同请求的response类型不同，有的是http，有的是tcp，该如何处理
             * 2. 如果都是http，如果一个返回的是json，一个是普通的文本，一个是文件，该如何处理？
             * 考虑了一下，现阶段还是直接全json返回就行了，不处理非json的文档
             */

            let res_headers = Object.assign({}, response_list[0].headers);
            delete res_headers['content-length'];
            let body_list = [];
            response_list.forEach(response => {
                body_list.push(response.body);
            });
            return {
                headers: res_headers,
                body: "[" + body_list.join(",") + "]" // 为了减少json parse, dump的时间
            };
        }
    }
}

RequesterManager.requesterMapping = {
    "http": HttpRequester
};

/**
 * 关于响应的结果如何标准化，这个会有点难，特别是涉及到多条回应的逻辑下
 */

module.exports = {RequesterManager};
