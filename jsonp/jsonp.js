// 实现jsonp
function jsonp(url, jsonpCallback, success) {
  let script = document.createElement("script");
  script.src = url;
  script.async = true;
  script.type = "text/javascript";
  window[jsonpCallback] = function(data) {
    success && success(data);
  };
  document.body.appendChild(script);
}

// //调用
// jsonp(
//   "http://localhost:3000",
//   "cb",
//   function(value) {
//     console.log(value);
//   }
// );

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if(xhr.readyState == 4 && xhr.status >=200 && xhr.status < 300) {
    response = xhr.responseText;
    console.log(response);
  }
};

xhr.open("post", "http://localhost:3000", true);
xhr.send(JSON.stringify({name: 111}));