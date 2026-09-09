var StateEnum = {
  "unclicked": 0,
  "clicked": 1,
  "highlight": 2
};

Object.freeze(StateEnum);

class Highlighter {

  constructor() {
    this._opacity = 0.45;
  }

  get box() {
    return this._box
  }
  set box(box) {
    if (this._box) {
      this._box.remove()
    }
    this._box = box
    this._box.node.setAttribute("rx", 20);
    this._box.node.setAttribute("ry", 20);
    this.isVisible()
  }

  set part(part) {
    this._part = part
  }

  isVisible() {
    if (this._box) {
      if (this._part && this._part.isVisible()) {
        this._box.node.style.opacity = this._opacity
      } else {
        this._box.node.style.opacity = 0
      }
    }
  }

  clear() {
    console.log("clear")
    this._box.remove()
  }


}

//----------------------------------------------------------------------

function BuildGuide(svg, tempSteps) {

  //------------------------------------------------------------FIELDS

  //Arrays for access to all of a type.
  //    "use strict";
  let kit = svg.selectAll("#KIT");
  let pcbs = svg.selectAll("[type=PCB]");
  let sids = svg.selectAll("[type=SIDE]");
  let brds = svg.selectAll("[type=BG]");
  let pars = svg.selectAll("[type=COM]");
  //visible PCB
  let activePcb;
  //Buttons
  let pcbButton, sidButton, dimButton, winButton, deleteSaveButton;
  let buttons = document.getElementsByTagName("button");
  // dom containers
  //setInterval vars

  let steps = tempSteps;

  //dim state
  let dim = true;

  let initialQuietClick = true
  let highlighter = new Highlighter()
  highlighter.box = svg.select("#KIT").rect(0, 0, 0, 0)
  highlighter.box.node.id = "highlighter-rect"

  const Storage = window.localStorage;



  //--------------------------------------------------------FUNCTIONS
  var setupPcbState = function () {

    //This function sets up the to show the right starting side;

    for (var i = 0; i < pcbs.length; i++) {
      if (pcbs[i].attr("id").substring(0, 2) != "MB") {
        pcbs[i].attr("opacity", "0");
        pcbs[i].attr("display", "none");
        pcbs[i].attr("isOn", "false");
        pcbs[i].node.style.pointerEvents = "none"
      } else {
        pcbs[i].attr("opacity", "1");
        pcbs[i].attr("isOn", "true");
        pcbs[i].attr("display", "inline");
        pcbs[i].node.style.pointerEvents = "visible"
        activePcb = pcbs[i];
      }
    }
    for (let i = 0; i < sids.length; i++) {
      if (sids[i].attr("id").substring(0, 3) != "TOP") {
        sids[i].attr("opacity", "0");
        sids[i].attr("isOn", "false");
        sids[i].attr("display", "inline");
        sids[i].node.style.pointerEvents = "none"

      } else {
        sids[i].attr("opacity", "1");
        sids[i].attr("isOn", "true");
        sids[i].attr("display", "inline");
        sids[i].node.style.pointerEvents = "visible"
      }
    }

    var tempPars = [];

    for (let i = 0; i < pars.length; i++) {
      pars[i].attr("opacity", "0");
      pars[i].attr("busy", "false");
      tempPars[i] = new Part(pars[i]);

    }

    pars = tempPars;


    //This is where the reading of the save must occur<------------------------READ

    let savedState = Storage.getItem(window.location.href + window.location.pathname);
    if (savedState) {
      console.log("SAVE DETECTED");

      savedState = JSON.parse(savedState);

      try {
        for (let x in savedState) {
          let target = pars.find(y => y.id == savedState[x][0]);
          target.state = savedState[x][1];
          target.changed = true;
          toChange.push(target)
        }
      }
      catch (err) {
        console.log(err)
        hardReset()
      }

      //console.log(savedState);
    } else {
      console.log("NO SAVE DETECTED");
    }


    //OLD BOOKMARK SYSTEM: DEPRECATED
    var parser = document.createElement('a');
    parser.href = window.location.href;
    if (parser.hash != null && parser.hash.substring(0, 5) == "#step") {
      let index = parseInt(parser.hash.substring(5));
      if (!isNaN(index)) {
        for (i = 1; i <= index && i < 100; i++) {
          // console.log("step" + i);
          pars.filter(
            function (x) {
              if (x.part.attr("step") == i) {
                // console.log(x.part.attr("step"));
                x.changed = true;
                toChange.push(x)
                x.state = StateEnum.clicked;
                return x;
              }
            });
        }
        // console.log(".step" + (index + 1));
        bookmark = (index + 1);
      }
    }



    //Fade in KIT group once everything is setup.
    kit[0].node.style.opacity = 1
  }
  var pcbSwitch = function (nodeId) {

    if (typeof nodeId == "object") {
      nodeId = null;
    }

    if (nodeId != null) {

      for (let i = 0; i < pcbs.length; i++) {

        if (pcbs[i].node.id == nodeId) {
          pcbs[i].attr("isOn", "true");
          activePcb = pcbs[i];
        } else {
          pcbs[i].attr("isOn", "false");
        }


      }

    } else {
      let firstTrueFound = false;
      for (let i = pcbs.length - 1; i >= 0; i--) {
        if (pcbs[i].attr("isOn") == "true" && !firstTrueFound) {
          firstTrueFound = true;
          //Sets current to false
          pcbs[i].attr("isOn", "false");

          //this if determines new activePCB
          if ((i - 1) < 0) {
            pcbs[pcbs.length - 1].attr("isOn", "true");
            activePcb = pcbs[pcbs.length - 1];
          } else {
            pcbs[i - 1].attr("isOn", "true");
            activePcb = pcbs[i - 1];
          }
        }
      }
    }


    updatePcb()
    highlighter.clear()

  };
  var updatePcb = function () {

    for (let i = 0; i < pcbs.length; i++) {
      if (pcbs[i].attr("isOn") == "false") {
        if (pcbs[i].attr("id") == "MB") {

          pcbs[i].node.style.opacity = 0.2
          pcbs[i].node.style.pointerEvents = "none"



        } else {
          pcbs[i].node.style.opacity = 0;
          pcbs[i].node.style.pointerEvents = "none"
          pcbs[i].node.style.display = "none"
        }
      } else {
        pcbs[i].node.style.opacity = 1;
        pcbs[i].node.style.pointerEvents = "auto"
        pcbs[i].node.style.display = "inline"
      }
    }
  }

  //let sideIsChanged = false;

  function sidTgl() {
    //sideIsChanged = true;
    for (let i = 0; i < sids.length; i++) {
      if (sids[i].attr("isOn") == "false" && sids[i].parent().attr("id") == activePcb.attr("id")) {

        sids[i].attr("isOn", "true");
      } else if (sids[i].attr("isOn") == "true" && sids[i].parent().attr("id") == activePcb.attr("id")) {
        sids[i].attr("isOn", "false");
      }
    }
    updateSid()
    highlighter.clear()
  }
  var updateSid = function () {

    for (let i = 0; i < sids.length; i++) {
      if (sids[i].attr("isOn") == "false" && sids[i].parent().attr("id") == activePcb.attr("id")) {
        //sideIsChanged = false;

        sids[i].node.style.opacity = 0
        // sids[i].node.style.display = "none"
        sids[i].node.style.pointerEvents = "none"

        //console.log("OhNo");

      } else if (sids[i].attr("isOn") == "true" && sids[i].parent().attr("id") == activePcb.attr("id")) {

        sids[i].node.style.opacity = 1
        sids[i].node.style.pointerEvents = "auto"
        // sids[i].node.style.display = "inline"
      }
    }
  }
  let dimChanged = false
  var dimTgl = function () {

    dim = !dim;
    dimChanged = true
    updateDim()


  };
  var updateDim = function () {
    if (dimChanged) {
      dimChanged = false
      highlighter.box.node.classList.toggle("dark")
      if (dim != true) {


        for (i = 0; i < brds.length; i++) {

          brds[i].attr("opacity", "0.4")

          dimButton.style.opacity = 0.5
        }

      } else {

        for (i = 0; i < brds.length; i++) {

          brds[i].attr("opacity", "1")
          dimButton.style.opacity = 1

        }

      }
    }



  };

  let deleteData = () => {
    event.stopPropagation()
    if (window.confirm("This will reset your progress and reload the page. Are you sure?")) {
      Storage.removeItem(window.location.href + window.location.pathname);
      location.reload();
    }


  }
  var makeControls = function () {

    let cont = document.getElementById("controls");
    cont.classList.add("grid-controls")

    if (pcbs.length != 1) {
      pcbButton = document.createElement("button");
      pcbButton.innerHTML = "Switch PCB";
      pcbButton.onclick = pcbSwitch;
      // pcbButton.style.marginLeft = "0px";
      pcbButton.style.marginTop = "0px";
      pcbButton.className = "diyre-menu";
      cont.appendChild(pcbButton);
    }
    sidButton = document.createElement("button");
    sidButton.innerHTML = "Switch Side";
    sidButton.onclick = sidTgl;
    sidButton.style.marginTop = "0px";
    sidButton.className = "diyre-menu";
    cont.appendChild(sidButton);
    dimButton = document.createElement("button");
    dimButton.innerHTML = "Dim PCB";
    dimButton.onclick = dimTgl;
    dimButton.style.marginTop = "0px";
    dimButton.className = "diyre-menu";
    cont.appendChild(dimButton);
    deleteSaveButton = document.createElement("button");
    deleteSaveButton.innerHTML = "Reset";
    deleteSaveButton.onclick = deleteData;
    deleteSaveButton.style.marginTop = "0px";
    deleteSaveButton.className = "diyre-menu";
    cont.appendChild(deleteSaveButton);
    winButton = document.createElement("button");
    winButton.style.display = "none";
    winButton.innerHTML = "You Win";
    winButton.onclick = winTgl;
    winButton.style.marginTop = "0px";
    winButton.style.transition = "background-color 0.4s linear";
    cont.appendChild(winButton);

  };
  var makeList = function () {
    // console.log("make List called! here")
    let maxStep = 0;
    for (let i = 0; i < pars.length; i++) {

      if (parseInt(pars[i].part.attr("step")) > maxStep) {
        maxStep = parseInt(pars[i].part.attr("step"));
        //console.log(pars[i].part + " " + "max")
      }
    }
    //(maxStep);

    for (let i = 1; i <= maxStep; i++) {
      var stepHead = document.createElement("h3");
      var stepP = document.createElement("p");
      var stepDiv = document.createElement("div");
      var stepUnd = document.createElement("div");
      var hr = document.createElement("hr");

      let stepParts = document.createElement("div")
      stepParts.classList.add("grid-container")


      hr.style.height = "2px";
      hr.style.margin = "10px 0px";

      // stepUnd.className = "underline";
      stepDiv.setAttribute("step", i);
      stepHead.style.fontSize = "17px";
      // console.log(steps["T" + i] + " " + i);
      stepHead.innerHTML = "<i>" + steps["T" + i][0]
        + " </i> <span class='detail'>"
        + steps["T" + i][1]; + "</span>"
      stepHead.className += "step" + i;
      stepHead.style.outline = "none";
      // stepHead.style.borderBottom = "1px";
      stepP.innerHTML = steps[i];
      var step = pars.filter(function (x) {
        if (x.part.attr("step") == i) {
          return x;
        }
      });
      //fix 
      step = step.sort(compareRefDes);
      // step = step.reverse()
      //console.log(step);
      stepDiv.appendChild(stepUnd);
      stepDiv.appendChild(stepP);
      stepDiv.appendChild(stepParts)

      for (let j = 0; j < step.length; j++) {

        stepParts.appendChild(step[j].button);

      }

      let list = document.getElementById("list");

      list.appendChild(stepHead);
      stepHead.appendChild(hr);
      list.appendChild(stepDiv);

    }

  };
  var partsTgl = function () {

    var test = pars.filter(function (x) {
      if (x.state == 2) {
        x.state = StateEnum.clicked;
        x.changed = true;
        toChange.push(x)
        return x;
      }

    });



  };
  let toChange = []
  var updatePar = function () {


    // console.log(`toChange.length: ${toChange.length}`)

    while (toChange.length > 0) {
      tempCh = toChange.pop()
      if (tempCh.state == StateEnum.highlight) {
        // let tempHL = tempCh.BBox
        highlighter.part = tempCh
        highlighter.box = svg.select("#KIT").rect(
          tempCh.BBox.x - 9,
          tempCh.BBox.y - 9,
          tempCh.BBox.w + 18,
          tempCh.BBox.h + 18
        )
        highlighter.box.node.id = "highlighter-rect"

        if (dim) {

        } else {
          highlighter.box.node.classList.add("dark")
        }

        if (initialQuietClick) {
          initialQuietClick = false;
          tempCh.clickPart("silent");

        }

        tempCh.part.node.style.opacity = 1
        // tempCh.button.className = "part-high"
        tempCh.button.classList.add("part-high")
        tempCh.button.classList.remove("part-clicked")
        tempCh.button.classList.remove("part-unclicked")
      } else if (tempCh.state == StateEnum.clicked) {
        tempCh.part.node.style.opacity = 1
        tempCh.button.classList.remove("part-high")
        tempCh.button.classList.add("part-clicked")
        tempCh.button.classList.remove("part-unclicked")
        // tempCh.button.className = "part-clicked"
      } else if (tempCh.state == StateEnum.unclicked) {
        tempCh.part.node.style.opacity = 0
        tempCh.button.classList.remove("part-high")
        tempCh.button.classList.remove("part-clicked")
        tempCh.button.classList.add("part-unclicked")
        // tempCh.button.className = "part-unclicked";
      }
    }




    //  <------------------------------------------write

    updateBar()
    Storage.setItem(window.location.href + window.location.pathname, JSON.stringify(pars.map((x) => ([x.id, x.state]))));

  };



  var updateBar = function () {



    let selected = pars.filter(function (x) {
      if (x.state != StateEnum.unclicked) {
        return x;
      }
    }).length;

    let selOptionalParts = pars.filter(function (x) {
      return x.part.attr("optional") == "true" && x.state != StateEnum.unclicked;
    }).length;
    let optionalParts = pars.filter(function (x) {
      return x.part.attr("optional") == "true";
    }).length;

    if (100 / (pars.length - optionalParts) * (selected - selOptionalParts) <= 100) {
      document.getElementById("myBar").style.width = (100 / (pars.length - optionalParts) * (selected - selOptionalParts) + "%");
    }

    if (100 / (pars.length - optionalParts) * (selected - selOptionalParts) == 100 && winButton.style.display == "none") {
      winButton.style.display = "inline-block"
    } else if (winButton.style.display == "inline-block") {
      winButton.style.backgroundColor = getRandomColor()
    }


  };





  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 10) + 6];
    }
    return color;
  }
  //-----------------------------------------------------------CLASSES
  var Part = function (domIn) {
    this.clickPart = function (quietClick) {
      console.log(quietClick.target);

      if (typeof quietClick == "object") {
        partsTgl();
      }

      toChange.push(this)
      this.changed = true;

      if (this.state == 0) {
        this.state = StateEnum.highlight;
      } else if (this.state == 1) {
        this.state = StateEnum.unclicked;
      }
      if (this.pcb.attr("isOn") == "false") {
        //console.log(this.pcb.node.id);
        pcbSwitch(this.pcb.node.id);
      }
      if (this.side.attr("isOn") == "false") {
        sidTgl();
      }

      updatePar()



    };


    this.isVisible = () => {
      if (this.pcb.attr("isOn") == "true" && this.side.attr("isOn") == "true") {
        return true
      } else {
        return false
      }
    }

    if (domIn.attr("alt-name") !== "null") {

      this.id = domIn.attr("alt-name")

    } else {

      this.id = domIn.attr("id")

    }


    this.part = domIn;

    this.button = document.createElement("button");
    this.button.onclick = this.clickPart.bind(this);
    this.button.className = "part-unclicked"
    this.button.classList.add("part-button")

    this.button.innerHTML = this.id + " <b>" + domIn.attr("val") + "</b>";
    this.state = StateEnum.unclicked;
    this.changed = false;
    this.side = this.part.parent().parent();
    this.pcb = this.side.parent();
    this.BBox = this.part.getBBox()


  };



  //------------------------------------------------------CONSTRUCTOR
  setupPcbState()
  makeControls()
  makeList()
  updatePar()
  updateLayout()


  let background = document.createElementNS(null, 'rect')
  background.setAttributeNS(null, 'x', 0)
  background.setAttributeNS(null, 'y', 0)
  background.setAttributeNS(null, 'width', 100)
  background.setAttributeNS(null, 'height', 100)
  background.setAttributeNS(null, 'style', "fill:rgb(0,0,255);")
  document.getElementById("KIT").append(background)

  document.getElementById("KIT").addEventListener('click', kitClick);

  function kitClick(x) {
    // console.log("kitClick")
    // console.log(x)
    let firstG = x.path.find(y => y.id && !y.id.includes("LWPOLY"))
    let firstPart = pars.find(x => x.id == firstG.id)
    // console.log(x.path)
    if (firstPart) {
      // firstPart.button.scrollIntoView({'behavior': 'smooth'})
      firstPart.button.onclick(x)
    } else {
      // console.log(`g: ${firstG} p: ${firstPart}`)
    }
  }
};



var winTgl = function () {

  let temp = document.getElementById("you-win");

  if (temp.style.display != "none") {
    temp.style.display = "none"
  } else {
    temp.style.display = "block"
    temp.style.backgroundColor = getRandomColor();
  }

}

function compareRefDes(a, b) {
  let nmbr = /\d/;
  let lttr = /\D/;

  a = a.id;
  b = b.id;

  if (compareChannel(a, b) != 0) {
    // console.log(` ${a} -- ${b} -- ${compareChannel(a,b)}`)
    return compareChannel(a, b)
  }

  a = a.split(" ")[0].split("_")[0];
  b = b.split(" ")[0].split("_")[0];

  let aLet = a.split(nmbr)[0];
  let aNum = a.split(lttr);
  aNum = aNum[aNum.length - 1];

  let bLet = b.split(nmbr)[0];
  let bNum = b.split(lttr);
  bNum = bNum[bNum.length - 1];

  // console.log(a + " - " + aNum +  " - " + aLet +  " -- " + b + " - " + bNum +  " - " + bLet);

  // -1 =  a < b -- 1 = a > b -- 0 = a == b

  if (aLet.localeCompare(bLet) < 0) {

    // console.log("-1 Let");
    return -1;

  } else if (aLet.localeCompare(bLet) > 0) {

    // console.log("1 Let");
    return 1;

  } else if (parseInt(aNum) < parseInt(bNum)) {

    // console.log("-1 Num");
    return -1;

  } else if (parseInt(aNum) > parseInt(bNum)) {

    // console.log("1 Num ");
    return 1;

  } else {

    // console.log("0 Both");
    return 0;

  }

}

function compareChannel(a, b) {

  let aCh = parseInt(a[a.indexOf("_") + 1])
  let bCh = parseInt(b[b.indexOf("_") + 1])

  // console.log(`aCh ${aCh} bCh ${bCh} -`)

  if (Number.isNaN(aCh) || Number.isNaN(bCh)) {
    // console.log("compareDB")
    return compareDB(a, b)
  }
  if (aCh > bCh) {
    return 1
  } else if (bCh > aCh) {
    return -1
  } else {
    return 0
  }

}

function compareDB(a, b) {

  let aCh = parseInt(a[a.indexOf("-") + 1])
  let bCh = parseInt(b[b.indexOf("-") + 1])
  // console.log(`a ${a} : ${aCh} b ${b} : ${bCh} --`)
  if (Number.isNaN(aCh) || Number.isNaN(bCh)) {
    return 0;
  }
  if (aCh > bCh) {
    return 1
  } else if (bCh > aCh) {
    return -1
  } else {
    return 0
  }

}