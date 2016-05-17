/**
 * Created by wanghui on 16-5-16.
 */

var express = require("express");
var http = require("http");

var app = express();

app.all("*",function (request,response,next) {
    console.log("step 1");
    next();
});

app.get("/",function (request,response) {
    response.end("Home Page!");
});

app.get("/about",function (request,response) {
   response.end("About Page!");
});

app.get("*",function (request,response) {
    response.end("404!");
});

http.createServer(app).listen(1982);