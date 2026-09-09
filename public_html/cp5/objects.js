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

function blink(target){
  target.animate({"opacity": 1}, 500, function(){
    target.animate({"opacity": 0.25}, 500), function(){
      target.animate({"opacity": 0.25}, 500)}
    })};
  //)};



function PCB(tempPCB) {

  //PRIVATE FUNCTIONS----------------------------->

  //PUBLIC FUNCTIONS------------------------------>
    this.tglDim = function() {

      this.dim = !this.dim;

      this.draw();
      //partList.updateAnimation();

    };

    this.draw = function() {

      if(this.dim){
        this.image.animate({opacity:0.3},750);
      } else {
        this.image.animate({opacity:0.8},750);
      };



    };
    this.addButton = function(input) {
    var button  = document.createElement("button");
    button.innerHTML = input;
    //button.className = "listItem";
    button.className = "btn btn-default";
    button.style.backgroundColor = "#A9A9A9";
    document.getElementById('controls').appendChild(button);


    return button;

    };

  //PRIVATE FIELDS-------------------------------->

  //PUBLIC FIELDS--------------------------------->
    this.dim = false;
    this.image = tempPCB;
    this.button = this.addButton("Dim PCB");

  //CONSTRUCTOR----------------------------------->

  this.button.onclick = this.tglDim.bind(this);

  this.image.click(partList.updateAnimation);

};


function PartList(domIn) {

  //PRIVATE FUNCTIONS----------------------------->

  //PUBLIC FUNCTIONS------------------------------>
    this.addPart = function(newPart){

      allparts.push(newPart);


    };

    this.updateAnimation = function(){



        for(x in allparts){

          if(allparts[x].state == StateEnum.highlight) {

            allparts[x].state = StateEnum.clicked;


            //allparts[x].part.animate({opacity: 1}, 500);
            blink(allparts[x].part);
            allparts[x].blink = setInterval(blink.bind(null, allparts[x].part), 1500);

            allparts[x].button.style.backgroundColor = "#aae";
            //highlight button and target

          } else if (allparts[x].state == StateEnum.clicked) {
            clearInterval(allparts[x].blink);
            allparts[x].part.animate({opacity: 0.5}, 1000);
            allparts[x].button.style.backgroundColor = "#f9f9f9"
            //dull button and target


          } else if (allparts[x].state == StateEnum.unclicked) {

            clearInterval(allparts[x].blink);
            allparts[x].part.animate({opacity: 0}, 500);
            allparts[x].button.style.backgroundColor = "#A9A9A9"

            //reset

          }



      }
    };

  //PRIVATE FIELDS-------------------------------->

  //PUBLIC FIELDS--------------------------------->

    var allparts = [];
    var dim = false;

  //CONSTRUCTOR----------------------------------->


};

function Part(domIn) {



  //PRIVATE FUNCTIONS----------------------------->



  //PUBLIC FUNCTIONS------------------------------>
    this.addButton = function(){
      var button  = document.createElement("button");
      var list   = document.getElementById('list');
      var target = document.getElementById("step" + this.part.attr("step"));
      var collapse;

      button.innerHTML = this.part.attr("resdef").toUpperCase();
      //button.className = "listItem";
      button.className = "btn btn-default"
      button.style.backgroundColor = "#A9A9A9"

      if(target == null){
        // none of this worked;

        collapse = document.createElement("a");
        collapse.id = ("step" + this.part.attr("step") + "tgl");
        collapse.className = "btn btn-info";
        collapse.setAttribute("href", "#" + "step" + this.part.attr("step"));
        collapse.setAttribute("data-toggle", "collapse");
        collapse.innerHTML = collapse.id
        list.appendChild(collapse);
        // down to here.
        target = document.createElement("div");
        target.id = ("step" + this.part.attr("step"));
        target.appendChild(button);

      } else {
        target.appendChild(button);

      };
      list.appendChild(target);

        return button;

    };

    this.checkedOff = function(x){

        if (this.state == StateEnum.unclicked) {

          this.state = StateEnum.highlight;

        } else {

          this.state = StateEnum.unclicked;

        };
        partList.updateAnimation();

      };




  //PUBLIC FIELDS--------------------------------->
    this.part = domIn;
    this.button = this.addButton();
    this.state = StateEnum.unclicked;
    this.blink;
  //PRIVATE FIELDS-------------------------------->




  //CONSTRUCTOR----------------------------------->



    this.part.click(this.checkedOff.bind(this));

    this.button.onclick = this.checkedOff.bind(this);



  };
