var http = require('http');
var fs = require('fs');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');

var app = http.createServer(function(request,response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  //console.log("url.parse(_url, true):", url.parse(_url, true));
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
      var list = template.list(filelist);
      var control = '';

      if (title == undefined) { 
        title = 'Welcome WEB';
      } else {
        title = path.parse(title).base;
      }

      fs.readFile(`data/${title}`, 'utf8', function(error, description) { 
        if (title == 'Welcome WEB' && description == undefined) { 
          description = 'Hello, Node.js....';
          control = `<a href="/create">create</a>`;
        } else if (description == undefined) {
          response.writeHead(404);
          response.end('Not Found');
        } else {
          control = `<a href="/create">create</a>
                      <a href="/update?id=${title}">update</a>
                      <form action="/process_delete", method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                      </form>
                    `;
        }        
        
        var html = template.HTML(title, list, 
          `<h2>${title}</h2><p>${description}</p>`,
          control
        );

        response.writeHead(200);      
        response.end(html);
      });
    });
  } else if (pathname == '/create') {
    fs.readdir('./data', function (error, filelist) {
      var list = templateList(filelist);
      var html = template.HTML(title, list, `
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
      `, '');
      response.writeHead(200);      
      response.end(html);
    });
  } else if (pathname == '/process_create') {
    var body = '';
    // 일정량의 data
    request.on('data', function (data) {     
      body += data;
    });   
  
    request.on('end', function () {
      var post = qs.parse(body);
      console.log('process_create.post:', post);
      var title = post.title;
      var description = post.description; 
      fs.writeFile(`data/${title}`, description, 'utf8', function(error) {
        // redirection
        response.writeHead(302, {Location: `/?id=${title}`});      
        response.end('success');
      });
    });
  } else if (pathname == '/update') {
    fs.readdir('./data', function (error, filelist) {
      fs.readFile(`data/${title}`, 'utf8', function(error, description) {
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
          <form method="POST" action="http://localhost:3000/process_update">
            <input type="hidden" name="id" value="${title}">
            <p>
              <input type="text" name="title" value="${title}" placeholder="title">
            </p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>        
        `, '');
        response.writeHead(200);      
        response.end(html);
      });
    });
  } else if (pathname == '/process_update') {
    var body = '';
    // 일정량의 data
    request.on('data', function (data) {     
      body += data;
    });   
  
    request.on('end', function () {
      var post = qs.parse(body);
      console.log('process_update.post:', post);
      var id = post.id;
      var title = post.title;
      var description = post.description; 
      // rename
      fs.rename(`data/${id}`, `data/${title}`, function(error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(error) {
          // redirection
          response.writeHead(302, {Location: `/?id=${title}`});      
          response.end('success');
        });
      });
    });
  } else if (pathname == '/process_delete') {
    var body = '';
    // 일정량의 data
    request.on('data', function (data) {     
      body += data;
    });   
  
    request.on('end', function () {
      var post = qs.parse(body);
      console.log('process_delete.post:', post);
      var id = path.parse(post.id).base;
      // delete
      fs.unlink(`data/${id}`, function(error) {
        if (error) throw error;

        response.writeHead(302, {Location: `/`});      
        response.end();
      });
    });      
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }    
});

app.listen(3000);
