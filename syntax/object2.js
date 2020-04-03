var f = function(){
  console.log(1+1);
  console.log(1+2);
}

console.log(f);

// 배열
var a = [f];
a[0]();
 
// 객체
var o = {
  func:f
}
o.func();
