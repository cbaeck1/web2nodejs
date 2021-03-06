
var template = {
  HTML:function(title, list, body, control) {
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
        <!-- CRUD --> 
        ${control}
        <!-- 글 내용 --> 
        ${body}
      </body>
      </html>
    `;
  },
  list:function(filelist) {
    var list = '<ol>';
    var i = 0;
    while (i < filelist.length) {
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i++;
    }        
    return list += '</ol>';  
  }
} 

module.exports = template;