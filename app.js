/**
 * Module dependencies.
 */

var express = require("express");
var router = express.Router();
var routes = require("./routes");
var img = require("./routes/image");
var manage = require("./routes/manage");
var upload = require("./routes/upload");
var admin = require("./routes/admin");

var http = require("http");
var path = require("path");
var config = require("./config");
var favicon = require("serve-favicon");
var logger = require("morgan");
var methodOverride = require("method-override");
var session = require("express-session");
var bodyParser = require("body-parser");
var multer = require("multer");
var errorHandler = require("errorhandler");
var morgan = require("morgan");

var fs = require("fs");
var errorLog = fs.createWriteStream(config.errorlog, { flags: "a" });

process.on("uncaughtException", function(err) {
  console.trace(err);
  errorLog.write("\n[" + new Date() + "]" + "Caught exception: " + err);
});

var start = function() {
  var app = express();

  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");

  app.use(router);
  app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
  app.use(logger("dev"));
  app.use(methodOverride());
  app.use(session({ resave: true, saveUninitialized: true, secret: "uwotm8" }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  //   app.use(bodyParser.uploadDir);
  //   app.use(
  //     multer({
  //       dest: config.tmproot
  //     })
  //   );

  app.use(express.static(path.join(__dirname, "public")));

  // development only
  if ("development" == app.get("env")) {
    app.use(errorHandler());
  }

  //index
  router.get("/", routes.index);

  //copy
  router.get("/copy", routes.copy);

  //get img
  router.get(
    /^\/\d{1,9}\/[0-9a-f]{32}(?:-\d+-\d+)?(-f|-s)?\.(jpg|jpeg|gif|png)$/,
    img.read
  );

  //img manage
  router.get(
    /^\/\d{1,9}\/[0-9a-f]{32}(?:-\d+-\d+)?(-f|-s)?\.(jpg|jpeg|gif|png)\/manage-(tleft|tright|del|resize|info)$/,
    manage.exec
  );

  //img upload
  router.post(
    /^\/\d{1,9}\/upload$/,
    multer({
      dest: config.tmproot
    }).any(),
    upload.exec
  );

  //admin
  router.post("/admin", admin.exec);

  //nginx monitor
  router.get("/_jiankong.jsp", function(req, res) {
    res.send(200, "ok");
    res.end();
  });

  http.createServer(app).listen(config.port, function() {
    console.log("%s:%s", new Date(), "server listening:" + config.port);
  });
};

start();

/******************************************************************
 * use cluster

var cpuNums = require('os').cpus().length;
var cluster = require('cluster');
var workers = {};
if (cluster.isMaster) {
    cluster.on('death', function (worker) {
        delete workers[worker.pid];
        worker = cluster.fork();
        workers[worker.pid] = worker;
    });
    for (var i = 0; i < cpuNums; i++) {
        var worker = cluster.fork();
        
        workers[worker.pid] = worker;
    }
} else {
    start();
}
 */
