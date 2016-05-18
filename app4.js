/**
 * Created by wanghui on 16-5-16.
 */

var express = require("express");
var http = require("http");
var path = require('path');
var app = express();



// 模板目录：./views
app.set("views", __dirname+'/views');

// 使用jade引擎
//app.set('view engine', 'jade');
// 使用html引擎
app.set('view engine', 'ejs');

//寻址views/index,提交jade渲染，并返回结果
app.get('/',function (request,response) {
    response.render("index",{message:"I'm a.h" ,title:"test ejs"})
    
});
http.createServer(app).listen(1982);