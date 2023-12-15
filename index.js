var cp = require('child_process')
var express = require("express");
var fs = require("fs");
var https = require("https");
var app = express();

app.get("/", function (req, res) {
  res.send("hello world");
});

app.get("/rce/attack", (req, res) => {
  var payload = req.query["payload"];
  var cmd = 'ping -c 2 ' + payload;
  if (!cmd) {
    res.send("Please provide valid command");
    return;
  }
  cp.exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(stdout + stderr);
    return;
  });
});

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert"),
    },
    app
  ).listen(3000, function () {
    console.log(
      "Example app listening on port 3000! Go to https://localhost:3000/"
    );
  });

