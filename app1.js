/**
 * Created by wanghui on 16-5-16.
 */

// 加载所需模块
var http = require("http");

// 创建Server
var app = http.createServer(function (request,response) {
    if (request.url=='/'){
        response.writeHead(200,{"Content-Type":"text-plain"});
        response.end("home page\n");
    } else if(request.url=='/about'){
        response.writeHead(200,{"Content-Type":"text-plain"});
        response.end("About page\n");

    }else {
        response.writeHead(404,{"Content-Type":"text-plain"});
        response.end("404 not found!\n");

    }

});

//启动app

app.listen(1982,"localhost");