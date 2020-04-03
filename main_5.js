var http = require('http');
var fs = require('fs');
var url = require('url');
var fs = require('fs');

var app = http.createServer(function(request,response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    console.log("url.parse(_url, true):", url.parse(_url, true));
    console.log("queryData:", queryData);
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    // if(_url == '/') {
    //   title = 'welcome';
    // }
    // if(_url == '/favicon.ico') {
    //     response.writeHead(404);
    //     response.end();
    //     return;
    // }
    // response.end(fs.readFileSync(__dirname + _url));

    if (pathname == '/') {
      fs.readdir('./data', function (error, filelist) {
        console.log("filelist:", filelist);
        var list = '<ol>';
        var i = 0;
        while (i < filelist.length) {
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i++;
        }        
        list += '</ol>'; 

        fs.readFile(`data/${title}`, 'utf8', function(error, description) {
          if (title == undefined && description == undefined) { 
            title = 'Welcome WEB';
            description = 'Hello, Node.js....';
          } else if (description == undefined) {
            response.writeHead(404);
            response.end('Not Found');
          }
                    
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <!-- 글 목록 --> 
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          ` ;
          response.writeHead(200);      
          response.end(template);
        });
      });
    } else {
      response.writeHead(404);
      response.end('Not Found');
    }    
});
app.listen(3000);