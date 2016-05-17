# nodejs_study

  根据http://www.cnblogs.com/hyddd/p/4237099.html的bolg练习


前言

    最近，本屌在试用Node.js，在寻找靠谱web框架时发现了Express.js。Express.js在Node.js社区中是比较出名web框架，而它的定位是“minimal and flexible（简洁、灵活）”。

 
进击的Express.js
1. 底层的Http module

  Node有Http module，本质上，我们可以直接通过他写Web应用。Http module使用很简单：
  ```javascript  
  ////////////////
  // app.js
  ////////////////

  // 加载所需模块
  var http = require("http");

  // 创建Server
  var app = http.createServer(function(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/plain"
  });
  response.end("Hello hyddd!\n");
  });

  // 启动Server`
  app.listen(1984, "localhost");
  ```


  运行node app.js。访问http://localhost:1984，即可看到“Hello hyddd!”。

  现在问题来了，Web需要通过不同uri区分功能，如：/user/profile 表示用户信息，/about 表示网站简介……，而Http module并没有直接提供dispatch功能，当然，自己实现也不难：
```javascript

////////////////
// app1.js
////////////////

// 加载所需模块
var http = require("http");

// 创建Server
var app = http.createServer(function(request, response) {
  if(request.url == '/'){
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Home Page!\n");
  } else if(request.url == '/about'){
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("About Page!\n");
  } else{
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("404 Not Found!\n");
  }
});

// 启动Server
app.listen(1984, "localhost");

```

    如果要区别对待Http method，可以根据 request.method 判断。至此，Http module在此场景下的短板显露无疑。

 

2. 中间层：Middleware

    什么是middleware？根据牛文《A short guide to Connect Middleware》里定义，middleware就是一大坨handle requests的funcions。

    这里说明下，middleware是一个概念；而上面的Connect，是一个Http Server Framework，基于Http module扩展，可以说它是Express.js的前身。所以可以把Connect等价看作Express.js。先看个Demo:
```javascript

////////////////
// app2.js
////////////////

// 加载所需模块
var express = require("express");
var http = require("http");

// 创建server
var app = express();

// 增加一些middleware
app.use(function(request, response, next) {
  console.log("step1, url:" + request.url);
  next();
});
app.use(function(request, response, next) {
  console.log("step2");
  if(request.url == '/'){
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Main Page!\n");
  }
  next();
});
app.use(function(request, response, next) {  console.log("step2:");
  console.log("step3");
  if(request.url == '/about'){
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("About Page!\n");
  }
});


// 启动server
http.createServer(app).listen(1984);

```

     运行node app.js，访问：http://localhost:1984/，console结果是：

    step1，url:/

    step2

    Express通过 app.use 注册middleware，middlewares相当于request的handlers，在处理request时，顺序执行每一个handler（function），handler业务完成后，通过调用next();，决定是否调用下一个handler，说白了就是 链 处理。

    Middleware是Express.js非常重要的特性，没有之一。基于这个特性，Express.js继续实现了routing-dispatch（让你可以优雅地写request处理函数）, 公共的error处理（404，500处理），提供机制给开发者实施权限校验机制等等。而在各种Express.js文档中，这块的篇幅是最长的，Express.js很多的变化和淫荡技巧会在middleware得到体现。

 
3.1 顶层：Routing

    app2.js的里，虽然通过middleware方式，把“/”和“/about”独立出来，但和优雅的高可读代码还没半毛钱关系。Routing是基于Middleware特性，它其实就是匹配不同的request到不同的handler上：
```javascript

////////////////
// app3.js
////////////////

var express = require("express");
var http = require("http");
var app = express();

app.all("*", function(request, response, next) {
  console.log("step1");
  next();
});

app.get("/", function(request, response) {
  response.end("Home Page!");
});

app.get("/about", function(request, response) {
  response.end("About Page!");
});

app.get("*", function(request, response) {
  response.end("404!");
});

http.createServer(app).listen(1984);

```

    这样确实优雅了许多，至于更多的奇淫技巧可以参看各种文档。

 
3.2 顶层：Views

    额，Express加入了View处理机制，一起看看：
```javascript

var express = require("express");
var app = express();

// 模板目录：./views
app.set("views", __dirname + "/views");

// 使用jade引擎
app.set("view engine", "jade");
 
// 寻址views/index，提交jade渲染，并返回结果
app.get("/", function(request, response) { response.render("index", { message: "I'm hyddd" }); });

```

    Express的View机制还是简单的。

 
3.3 顶层：其他“小”特性

    我之所以称其他特性为“小”特性，是因为他们相对前两者（特别是Routing），在框架中的地位都是次要的。

    举个栗子：response，Express的response基于Http.Server的response扩展，提供了一些新功能，如：response.redirect("/user/login"); 和 response.sendFile("/path/to/file");。

    其他的，大家可以参考官方文档。

 
总结

    Express正如官网中的描述一样“minimal and flexible”。Express主要解决了 请求路由 和 视图模板 的问题，其中Middleware是它最重要的概念。它是不错的Web框架，但本屌还是有些想法的：

    1. Express不是MVC的框架，因为它没有对Model解决方案。嗯，有点废话，因为Express本身定位就不是MVC，只是minimal and flexible的Web框架。

    2. 由于Express实在是flexible，没有强制的规范约束，加上js是可以把代码写得很随意的编程语言，所以本屌找到的Demo中，Config，Controller，View的维护、管理、技巧都可能各式各样。

    所以，没有明确Model解决方案（当然你可以找第三方的）和弱规范约束，使整天踩在别人（巨人）肩膀上的本屌开始时不太适应。

 
参考资料

1. 《understanding-express》(http://evanhahn.com/understanding-express/)

2. 《A short guide to Connect Middleware》(http://stephensugden.com/middleware_guide/)

3. 《expressjs官方文档》(http://expressjs.com/4x/api.html)
