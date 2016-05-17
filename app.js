/**
 * Created by wanghui on 16-5-16.
 */

// 加载所需模块
var http = require("http");

// 创建Server
var app = http.createServer(function (request,response) {
    response.writeHead(200,{
        "content-Type":"text/plain"
    });
    response.write("hello world\n");

    response.end("Hello hyddd\n");
});

//启动app

app.listen(1982,"localhost");

