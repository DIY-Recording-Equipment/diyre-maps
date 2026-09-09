// function template() {
//
//   //PRIVATE FUNCTIONS----------------------------->
//
//   //PUBLIC FUNCTIONS------------------------------>
//
//   //PRIVATE FIELDS-------------------------------->
//
//   //PUBLIC FIELDS--------------------------------->
//
//   //CONSTRUCTOR----------------------------------->

// };

var StateEnum = {
  "unclicked": 0,
  "clicked": 1,
  "highlight": 2,
};

Object.freeze(StateEnum);


// function blinking(target){
//
//   target.animate({"opacity": 1}, 700, function(){
//     target.animate({"opacity": 0.25}, 400), function(){
//       target.animate({"opacity": 0.25}, 400)}
//
//     })};


//----------------------------------------------------------------------

  function BuildGuide(svg, tempSteps) {

//------------------------------------------------------------FIELDS

    //Arrays for access to all of a type.
    var kit  = svg.selectAll("#KIT");
    var pcbs = svg.selectAll("[type=PCB]");
    var sids = svg.selectAll("[type=SIDE]");
    var brds = svg.selectAll("[type=BG]");
    var pars = svg.selectAll("[type=COM]");
    //visible PCB
    var activePcb;
    //Buttons
    var pcbButton, sidButton, dimButton;
    // dom containers
    var list = document.getElementById("list");
    var cont = document.getElementById("controls");
    //setInterval vars
    var pcbInterval, sidInterval, parInterval, barInterval;
    var steps = tempSteps;

    //dim state
    var dim = true;







//------------------------------------------------------------FUNCTS
    var setupPcbState = function(){

      //This function sets up the to show the right starting side;

      for(let i = 0; i < pcbs.length; i++){
        if(pcbs[i].attr("id") != "MB"){
          pcbs[i].attr("opacity", "0");
          pcbs[i].attr("display", "none");
          pcbs[i].attr("isOn", "false");
        } else {
          pcbs[i].attr("opacity", "1")
          pcbs[i].attr("isOn", "true");
          pcbs[i].attr("display", "inline");
          activePcb = pcbs[i];
        };
      };
      for(let i = 0; i < sids.length; i++){
        if(sids[i].attr("id").substring(0,3) != "TOP"){
          sids[i].attr("opacity", "0")
          sids[i].attr("isOn", "false");
          sids[i].attr("display", "none")

        } else {
          sids[i].attr("opacity", "1")
          sids[i].attr("isOn", "true");
          sids[i].attr("display", "inline");

        };
      };

      var tempPars = [];

      for(let i = 0; i < pars.length; i++){
          pars[i].attr("opacity", "0")
          pars[i].attr("busy", "false");
          tempPars[i] = new Part(pars[i]);

      };

      pars = tempPars;

      var parser = document.createElement('a');
      parser.href = window.location.href;
      // console.log(parser.hash);
      // console.log(parser.hash.substring(0, 5));

      if(parser.hash != null && parser.hash.substring(0, 5) == "#step") {
        // console.log(parser.hash.substring(5));
        // console.log(parseInt(parser.hash.substring(5)));
        let index = parseInt(parser.hash.substring(5));

        if( !isNaN(index) ) {


            for(i = 1; i <= index && i < 100; i++) {
              // console.log("step" + i);
              pars.filter(
                function(x){
                  if(x.part.attr("step") == i){
                      // console.log(x.part.attr("step"));
                      x.changed = "true";
                      x.state = StateEnum.clicked;
                     return x;
                   }
                 });
               };
            // console.log(".step" + (index + 1));
            bookmark = (index + 1);
      };

      //Fade in KIT group once everything is setup.


      };
      kit.animate({"opacity": "1"}, 1000);
    }
    var pcbTgl        = function(){

      for(let i = 0; i < pcbs.length; i++){
        if(pcbs[i].attr("isOn") == "false"){
          //pcbs[i].attr("opacity", "1");
          //pcbs[i].animate({"opacity": "1"},750);
          pcbs[i].attr("isOn", "true");
          activePcb = pcbs[i];
        } else {
          //pcbs[i].attr("opacity", "0")
          //pcbs[i].animate({"opacity": "0"},750);
          pcbs[i].attr("isOn", "false");
        };
        //console.log(pars);
      }


    };
    var updatePcb     = function(){
      //console.log("0");
      for(let i = 0; i < pcbs.length; i++){
        if(pcbs[i].attr("isOn") == "false"){
          if(pcbs[i].attr("opacity") != "0") {
            //console.log("1");
            clearInterval(pcbInterval);
            //console.log("2");
            pcbs[i].animate({"opacity": "0"}, 750, function(){
              //console.log("3");
              pcbs[i].attr("display", "none");
              pcbInterval = setInterval(updatePcb, 100);
              //console.log(pcbInterval);
            });
            //console.log("OhNo");
            //console.log(pcbs[i].attr("opacity"));
          }
        } else {
          if(pcbs[i].attr("opacity") != "1") {
            pcbs[i].animate({"opacity": "1"}, 750);
            pcbs[i].attr("display", "inline");
            // pcbs[i].animate({"opacity": "1"}, 750, function(){pcbInterval = setInterval(updatePcb);});
          }
        };
      }



    };
    function sidTgl(){

      for(let i = 0; i < sids.length; i++){
        if(sids[i].attr("isOn") == "false" && sids[i].parent().attr("id") == activePcb.attr("id")){

          sids[i].attr("isOn", "true");
        } else if(sids[i].attr("isOn") == "true" && sids[i].parent().attr("id") == activePcb.attr("id")){
          sids[i].attr("isOn", "false");
        };
      }
    };
    var updateSid     = function(){

      for(let i = 0; i < sids.length; i++){
        if(sids[i].attr("isOn") == "false" && sids[i].parent().attr("id") == activePcb.attr("id")){
          if(sids[i].attr("opacity") != "0") {
            clearInterval(sidInterval);

            sids[i].animate({"opacity": "0"},750,function(){sids[i].attr("display", "none"); sidInterval = setInterval(updateSid, 100);});
            //console.log("OhNo");
          }
        } else if(sids[i].attr("isOn") == "true" && sids[i].parent().attr("id") == activePcb.attr("id")){
          if(sids[i].attr("opacity") != "1") {
            sids[i].animate({"opacity": "1"},750);
            sids[i].attr("display", "inline");
          }
        };
      }
    };
    var dimTgl = function() {

      dim = !dim;
      //console.log(dim);

    };
    var updateDim = function(){

      if(dim != true){

        for(i = 0; i < brds.length; i++) {

           brds[i].attr("opacity", "0.4");
           dimInterval.clearInterval
           dimButton.style.opacity = 0.5;
        //  brds.animate({"opacity": 0.5}, function(){dimInterval = setInterval(updateDim, 100)});
        }

      } else {

        for(i = 0; i < brds.length; i++) {

           brds[i].attr("opacity", "1");
           dimButton.style.opacity = 1;

        }

      }



    };
    var makeControls  = function(){

      pcbButton = document.createElement("button");
        pcbButton.innerHTML = "Switch PCB";
        pcbButton.onclick = pcbTgl;
        pcbButton.style.marginLeft = "0px";
        pcbButton.style.marginTop = "0px";
        cont.appendChild(pcbButton);
      sidButton = document.createElement("button");
        sidButton.innerHTML = "Switch Side";
        sidButton.onclick = sidTgl;
        sidButton.style.marginTop = "0px";
        cont.appendChild(sidButton);
      dimButton = document.createElement("button");
        dimButton.innerHTML = "Dim PCB";
        dimButton.onclick = dimTgl;
        dimButton.style.marginTop = "0px";
        cont.appendChild(dimButton);


    };
    var makeList      = function(){
      let maxStep = 0;
      for(let i = 0; i < pars.length; i++){

        if(parseInt(pars[i].part.attr("step")) > maxStep){
          maxStep = parseInt(pars[i].part.attr("step"));
        }
      };
      //(maxStep);

      for(let i = 1; i <= maxStep; i++){
        var stepHead = document.createElement("h3");
        var stepP    = document.createElement("p");
        var stepDiv  = document.createElement("div");
        var stepUnd  = document.createElement("div");
        var hr       = document.createElement("hr");

        hr.style.height = "2px";
        hr.style.margin = "10px 0px";

        stepUnd.className = "underline";
        stepDiv.setAttribute("step", i);
        stepHead.style.fontSize = "17px";
        stepHead.innerHTML = "<i>Bag " + i + " </i> " + steps["T"+i];
        stepHead.className += "step" + i;
        stepHead.style.outline = "none";
        // stepHead.style.borderBottom = "1px";
        stepP.innerHTML = steps[i];
        var step = pars.filter(function(x){if(x.part.attr("step") == i){return x}});
        //step = step.sort(function(a,b){a.part.attr("id") > b.part.attr("id")});
        step = step.sort(function(a,b){return a-b});
        //console.log(step);
        stepDiv.appendChild(stepUnd);
        stepDiv.appendChild(stepP);

        for(let j = 0; j < step.length; j++){

          stepDiv.appendChild(step[j].button);

        }

        list.appendChild(stepHead);

        stepHead.appendChild(hr);

        list.appendChild(stepDiv);

      };

    };
    var partsTgl      = function(){
      // console.log(x.id)
      var test = pars.filter(function(x){
        if(x.state == 2){
          x.state = StateEnum.clicked;
          x.changed = "true";
          return x;
        };

      });
      //console.log("2 -> 1:" + test);

    };
    var updatePar     = function(){


      var toChange = pars.filter(function(x){if(x.changed == "true"){x.changed = "false"; return x;}})
      // if(toChange.length > 0){console.log(toChange);};
      for(i in toChange){
        if(toChange[i].state == StateEnum.highlight){

          toChange[i].part.animate({"opacity": "1"}, 300);
          toChange[i].button.className = "highlight";
          //toChange[i].part.animate({"opacity": "1"}, 750);

          // if(toChange[i].blink == "false"){
          //   toChange[i].loop = "true";
          //   blinking(toChange[i].part);
          //   toChange[i].blink = setInterval(blinking.bind(null, toChange[i].part), 1500);
          // };

        } else if (toChange[i].state == StateEnum.clicked) {

        toChange[i].part.animate({"opacity": "0.5"}, 300);
        toChange[i].button.className = "clicked";
        } else if (toChange[i].state == StateEnum.unclicked) {

        toChange[i].part.animate({"opacity": "0"}, 110);
        toChange[i].button.className = "unclicked";
        }
      }

    };
    var findPcb       = function(){

      var activePar = pars.filter(function(x){
        if(x.state == StateEnum.highlight){return x};
      });

      var activeSid = sids.filter(function(y){

      });




    };
    var updateBar = function(){



      let selected = pars.filter(function(x){
        if(x.state != StateEnum.unclicked){
          return x
        }
      }).length;

      //console.log(pars.length + " -- " + selected);
      //console.log(100 / pars.length * selected);
      document.getElementById("myBar").style.width = (100 / pars.length * selected) + "%";
      // document.getElementById("myBar").animate({"width": (100 / pars.length * selected) + "%"})
    };
//-----------------------------------------------------------CLASSES
    var Part = function(domIn) {
      this.clickPart = function(){
        partsTgl();


        this.changed = "true";

        if(this.state == 0){
          this.state = StateEnum.highlight;
        } else if (this.state == 1){
          this.state = StateEnum.unclicked;
        };
        if(this.pcb.attr("isOn") == "false") {
          pcbTgl();
        };
        if(this.side.attr("isOn") == "false") {
          sidTgl();
        };


        //$(this.button.parentElement).click();
        //if(){};
        if(!$(".step" + this.part.attr("step")).hasClass( "ui-state-active" ))
          {
            $(".step" + this.part.attr("step")).click();
          };
        // console.log($(".step" + this.part.attr("step"));
        // console.log(".step" + this.part.attr("step"));
        // let temp1 = $( "#list > div,[step=" + this.part.attr("step") + "]");
        //let temp1 = $( "#list > div, [step=4]");

        // console.log(temp1);

        //console.log("Part: " + this.part + " Side: " + this.side.attr("id") + " PCB: " + this.pcb.attr("id"));

        //findPcb();

        //console.log(this.id);
        //console.log(this.state);
        //updatePar();


      }
      this.id = domIn.attr("id");
      this.part = domIn;
      this.button = document.createElement("button");
      this.button.onclick = this.clickPart.bind(this);
      this.button.style.fontWeight = 200;
      this.button.style.color = "black";
      this.button.style.textAlign = "left";
      this.button.style.margin = "3.5 7 3.5 0";
      // this.button.marginRight = "7px";
      this.button.className = "unclicked";

      this.part.click(this.clickPart.bind(this))
      this.button.innerHTML = this.id + " <b>" + domIn.attr("val") + "</b>";
      this.state = StateEnum.unclicked;
      this.changed = "false";
      this.side = this.part.parent().parent();
      this.pcb  = this.side.parent();
      //this.blink = "false";
      this.loop = "false";
      //console.log("Part: " + this.part + " Side: " + this.side + " PCB: " + this.pcb);
      //this.interval = setInterval(updateParts, 500);

    }



//------------------------------------------------------------CONSTRU
    setupPcbState();
    makeControls();
    makeList();


    pcbInterval = setInterval(updatePcb, 100);
    sidInterval = setInterval(updateSid, 100);
    parInterval = setInterval(updatePar, 50);
    barInterval = setInterval(updateBar, 100);
    dimInterval = setInterval(updateDim, 100);






  };
