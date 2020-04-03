var http = require('http');
var fs = require('fs');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

function templateHTML(title, list, body) {
  return `
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
      <a href="/create">create</a>
      ${body}
    </body>
    </html>
  `;
} 

function templateList(filelist) {
  var list = '<ol>';
  var i = 0;
  while (i < filelist.length) {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }        
  return list += '</ol>';  
}


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
        var list = templateList(filelist);

        fs.readFile(`data/${title}`, 'utf8', function(error, description) {
          if (title == undefined && description == undefined) { 
            title = 'Welcome WEB';
            description = 'Hello, Node.js....';
          } else if (description == undefined) {
            response.writeHead(404);
            response.end('Not Found');
          }
                    
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);

          response.writeHead(200);      
          response.end(template);
        });
      });
    } else if (pathname == '/create') {
      fs.readdir('./data', function (error, filelist) {
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
        <form method="POST" action="http://localhost:3000/process_create">
            <p>
                <input type="text" name="title" placeholder="title">
            </p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        `);
        response.writeHead(200);      
        response.end(template);
      });
    } else if (pathname == '/process_create') {

      var body = '';
      // 일정량의 data
      request.on('data', function (data) {     
        body += data;
      });   
    
      request.on('end', function () {
        var post = qs.parse(body);
        console.log('post:',post);
        var title = post.title;
        var description = post.description; 
        fs.writeFile(`data/${title}`, description, 'utf8', function(error){
          // redirection
          response.writeHead(302, {Location: `/?id=${title}`});      
          response.end('success');
        });
      });
    } else {
      response.writeHead(404);
      response.end('Not Found');
    }    
});
app.listen(3000);