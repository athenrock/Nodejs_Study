/**
 * Created by wanghui on 16-5-16.
 */

//加载所需模块
var express = require("express");
var http = require("http");

//创建server
var app = express();

// 增加一些middleware
app.use(function (request,response,next) {
    console.log("step 1,url"+request.url);
    next();
});
app.use(function (request,response,next) {
    console.log("step 2");
    if (request.url=="/"){
        response.writeHead(200,{"Content-Type":"text-plain"});
        response.end("Main Page!\n");
    }
    next();
});

app.use(function (request,response,next) {
    console.log("step 3");
    if (request.url=="/about"){
        response.writeHead(200,{"Content-Type":"text-plain"});
        response.end("about Page!\n");
    }

});

app.listen(1982,"localhost");