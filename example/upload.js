var port = 8080,
    serverUrl = "127.0.0.1",
    formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs = require('fs'),
    path = require("path");

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  var filename = req.url || "index.html";
  var ext = path.extname(filename);
  console.log(path);
  var localPath = __dirname;
  var validExtensions = {
    ".html" : "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png"
  };
  var isValidExt = validExtensions[ext];

    if (isValidExt) {

    localPath += filename;
    path.exists(localPath, function(exists) {
      if(exists) {
        console.log("Serving file: " + localPath);
        getFile(localPath, res, ext);
      } else {
        console.log("File not found: " + localPath);
        res.writeHead(404);
        res.end();
      }
    });

  } else {
    console.log("Invalid file extension detected: " + ext);
  }
}).listen(port, serverUrl);

function getFile(localPath, res, mimeType) {
  fs.readFile(localPath, function(err, contents) {
    if(!err) {
      res.setHeader("Content-Length", contents.length);
      res.setHeader("Content-Type", mimeType);
      res.statusCode = 200;
      res.end(contents);
    } else {
      res.writeHead(500);
      res.end();
    }
  });
}