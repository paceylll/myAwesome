// nodejs代码
const http = require("http");

http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.write("cb('cool!')");
  res.end();
}).listen("3000", "localhost");