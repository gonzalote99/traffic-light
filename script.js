function getDom(selector) {
   return document.querySelectorAll(selector);
}

function bindEvent(ele,eventType,callback) {
  if (typeof ele.addEventListener=== "function") {
    ele.addEventListener(eventType, callback, false);

  } else if (typeof ele.attachEvent === "function") {
    ele.attachEvent("on"+eventType,callback);
  } else {
    ele["on"+eventType]=callback;
   }
}


var trafficLight = {
  "lightBlink": function(light, color) {
    var ele = light;
    var lightColor = color;
    var flag = false;


    clearInterval(ele.timer);
    ele.timer = setInterval(function() {
      if(!flag) {
        ele.className = (ele.className).replace(lightColor, "black")
      } else {
        ele.className = (ele.className).replace("black", lightColor);
      }
      flag = !flag;
    }, 500);
    return ele.timer;
  },

  "closeAllLight": function(eq) {
    var lightBox = getDom(".lightBox")[eq];
    var lights = eq==="all"?getDom(".light"):lightBox.querySelector(".light");
    for (var i = 0, len= lights.length; i < len; i++) {
      lights[i].className =(lights[i].className).replace(/(red|yellow|green)/g, "black");

    }


  },

  "openLight": function(light, color) {
    var ele = light;
    var lightColor = color;

    ele.className =(ele.className).replace("black", lightColor);

  },

  "countDown": function(time,delay,data,timeTable) {
   var timer = data.timer;
   var curTime = time;
   var redLight = data.red;
   var yellowLight = data.yellow;
   var greenLight = data.green;
   var flag = data.flag;
   var eq = data.eq;
   var logo = 1;

   clearInterval(timer);
   timer = setInterval(function () {
     timeTable.innerHTML = curTime<10?"0" + curTime:curTime;
     if (curTime === 0) {
       clearInterval(trafficLight.lightBlink(yellowLight, 'yellow'));

       trafficLight.closeAllLight(eq);
       if(flag === "green") {
         redLight.className=(redLight.className).replace("black", "red");
         flag = "red";
       } else {
         greenLight.className=(greenLight.className).replace("black", "green");
         flag = "green";
       }
       if (logo === 1 ) {
         curTime += delay;
         logo = 0;
       } else if(logo === 0) {
         curTime += time+1;
         logo = 1;
       }

     }
     if (curTime === 4) {
       trafficLight.lightBlink(yellowLight, 'yellow');

     }
     curTime--;
   }, 1000);
   return timer;
  }

};


function init() {
  var lightBoxs = getDom(".lightBox");
  var redLights = getDom(".red");
  var greenLights = getDom(".green");
  var yellowLights = getDom(".yellow");
  var timeTabs = getDom(".timeTab");
  var data = [];
  var switchBtn = getDom("#switchBtn")[0];
  var yellowBtn = getDom("#yellowBtn")[0];
  var boo1 = true, boo2 = false;
  var t1 = [];
  var t2 = [];
  var greenTime =+ 5;
  var redTime =+  greenTime*3+4;
  for (var i = 0, len = lightBoxs.length; i < len; i++) {
    data[i] = {
      "red": redLights[i],
      "yellow": yellowLights[i],
      "green": greenLights[i],
      "flag" : "red",
      "time" : 0,
      "eq": i

    };
  }

  trafficLight.closeAllLight("all");
  bindEvent(switchBtn, "click", function() {
    trafficLight.closeAllLight("all");

    yellowBtn.innerHTML = "warning(on)";
    for (var i = 0; i < 8; i++) {
      t2[i] = trafficLight.lightBlink(data[i].yellow, "yellow");
      clearInterval(t2[i]);
      trafficLight.openLight(redLights[i], "red");
      if(boo1) {
        if (i >= 4 && i <= 7) {
            (function (n) {
              t1[n] = setTimeout(function () {
                data[n].timer = trafficLight.countDown(redTime,greenTime,data[n],timeTabs[n]);
              }, ((greenTime+1)*1000*(n-4)));
            })(i);

        } else {
          (function (n) {
            t1[n] = setTimeout(function() {
              data[n].timer = trafficLight.countDown(redTime,greenTime,data[n],timeTabs[n]);

            }, ((greenTime+1)*1000*n));
          })(i);
        }
        switchBtn.innerHTML= "OFF(switch)";

      } else {
        clearTimeout(t1[i]);
        clearInterval(data[i].timer);

        switchBtn.innerHTML="On(switch)";

      }
    }

    boo1=!boo1;

  });

  bindEvent(yellowBtn,"click", function() {
    trafficLight.closeAllLight("all");
    switchBtn.innerHTML = "ON(switch)";
    for(var i= 0; i < 8; i++) {
      clearTimeout(t1[i]);
      clearInterval(data[i].timer);
      timeTabs[i].innerHTML = "00";
      if (!boo2) {
       t2[i]=trafficLight.lightBlink(data[i].yellow,"yellow");
       yellowBtn.innerHTML = "OFF(warning)";
      }
      else {
        clearInterval(t2[i]);
        yellowBtn.innerHTML = "ON (switch)";
      }


    }
    boo2=!boo2;

  });




}

bindEvent(window,'load',init);
