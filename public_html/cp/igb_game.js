// var Game          = function(temp, dims){
//
//   var canvas = document.createElement('canvas');
//   canvas.setAttribute('id', 'canvas');
//   canvas.setAttribute('display', 'block');
//   canvas.setAttribute('visibility', 'visible');
//
//   document.getElementById('right').insertBefore(canvas, document.getElementById('svgContainer'));
//
//   var ctx    = canvas.getContext('2d');
//
//
//
//   // var foreignObj = document.createElement('foreignObject');
//   // foreignObj.appendChild(temp);
//
//   // var foreignObj = document.createElement('svg');
//   // foreignObj.appendChild(temp);
//
//   var DOMURL = window.URL || window.webkitURL || window;
//
//   var img = new Image();
//   // let svg = new Blob([temp], {type: "image/svg+xml"});
//   // svg.xmlns = "http://www.w3.org/2000/svg"
//   // let svg = new Blob([temp], {type: "text/html"});
//
//   let svg = document.createElement('svg');
//
//   svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
//   svg.appendChild(temp);
//
//   var tmp = document.createElement("div");
//   tmp.appendChild(svg);
//   console.log(tmp.innerHTML); // <p>Test</p>
//
//   svg = new Blob([tmp.innerHTML], {type: "image/svg+xml"});
//
//   console.log(temp);
//   console.log(svg);
//
//   var url = DOMURL.createObjectURL(svg);
//   // var url = "https://upload.wikimedia.org/wikipedia/commons/0/02/SVG_logo.svg";
//
//
//   img.onload = function() {
//     ctx.drawImage(img,0,0);
//     DOMURL.revokeObjectURL(url);
//     alert("image is loaded");
//
//   };
//
//   img.src = url;
//   $(img).appendTo('body');
//
//
// };
var game = null;



var s = function( p , temp) {



  p.setup = function () {
    p.createCanvas(600,200);
    document.getElementById("right").insertBefore(p.canvas, document.getElementById("svgContainer"));

    console.log("done!!");
    p.background(p.random(100));


  }

  p.draw = function () {
    p.background(235);
  }




}
