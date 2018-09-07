/*

这里的代码仅作测试使用

*/

module.exports.ping = function (req, res) {
    res.send("PONG,0.0.1");
};

module.exports.testGetWithqs = function (req, res) {
    console.dir(req.url);
    res.send("we got this some thing here");
};

module.exports.testPost = function (req, res) {
    var start = new Date().getTime();
    var buffer = "";
    req.on("data", function (chunk) {
        buffer += chunk;
    });

    req.on("end", function () {
        let cost_time = (new Date().getTime() - start) / 1000;
        console.log(`cost ${cost_time}s to finish`);
        res.send(`we got this here: ${buffer.length}`);
    });
};
