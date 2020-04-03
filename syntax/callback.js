var a = function(str) {
  console.log(str);
}

var strA = 'A값은 slowfuncA 외부에서 slowfuncA 인자로 제공';
a(strA);

function slowfuncA(str, callback) {
   callback(str);
}

slowfuncA(strA, a);

/* */

var b = function() {
  console.log('B값은 callback 내부에서 제공');
}

b();

function slowfuncB(callback) {
   callback();
}

slowfuncB(b);

/* */

var c = function(str) {
  console.log(str);
}

c('C값은 slowfuncC 내부 또는 callback함수의 인자로 제공');

function slowfuncC(callback) {
  var str = 'C값은 slowfuncC 내부 또는 callback함수의 인자로 제공';
   callback(str);
}

slowfuncC(c);
