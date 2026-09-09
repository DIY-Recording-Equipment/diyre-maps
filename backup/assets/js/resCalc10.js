//resCalc10.js

var letterVal = {
  "K": 1000,
  "M": 1000000,
  "R": 1,
  "G": 1000000000
};
var intBand = {
  "0": "black",
  "1": "brown",
  "2": "red",
  "3": "orange",
  "4": "yellow",
  "5": "green",
  "6": "blue",
  "7": "purple",
  "8": "gray",
  "9": "white"

}
var mulBand = {
  "1": "black",
  "10": "brown",
  "100": "red",
  "1000": "orange",
  "10000": "yellow",
  "100000": "green",
  "1000000": "blue",
  "10000000": "purple",
  "0.1": "gold",
  "0.01": "silver"

}
var resSvg;
Object.freeze(letterVal);
Object.freeze(intBand);
Object.freeze(mulBand);
ddArray = [];
rc = null;

function clearDrops(temp){
    var all = $(".resistor-dropdown");
    //console.log($(temp).attr('id'));
    for(var i = 0; i < all.length; i++){
        
        if($(all[i]).attr("id") !== $(temp).attr('id')){
           // console.log($(all[i]).attr("id"));
            $(all[i]).removeClass("active");
        } else {
            $(all[i]).toggleClass("active");
        }
    }
};

function applyColor(obj, bg){
    
    if(obj.selColor === "gold"){
                            
        var g = Snap().paper.gradient("l(0, 0, 0, 1)#4c462d-#ccb266-#4c462d");
        Snap(obj.svgId).attr('fill', g);

    } else if (obj.selColor === "silver"){

        var g = Snap().paper.gradient("l(0, 0, 0, 1)#3c3c3c-#b9b9b9-#3c3c3c");
        Snap(obj.svgId).attr('fill', g);

    } else {
        Snap(obj.svgId).attr('fill', bg);
    }
    
    
    
    
}

function DropDown(el) {
				this.dd = el;
				this.placeholder = this.dd.children('span');
				this.opts = this.dd.find('ul.dropdown > li');
				this.val = '';
				this.index = -1;
				this.initEvents();
                this.selColor = null;
                this.svgId = "#Band_"
			}
DropDown.prototype = {
				initEvents : function() {
					var obj = this;

					obj.dd.on('click', function(event){
                        
                        //this 'if' allows you to close dropdown while clicking on header
                        // console.log(event.currentTarget)
                        // console.log(this)
                        
                        if(event.currentTarget === this){
                            clearDrops(this);
                            //console.log("hello");
                        }  else {
                        
                        clearDrops();
                        $(this).toggleClass('active');
                        }
                        
                        
                        
						return false;
					});

					obj.opts.on('click',function(){


						var opt = $(this);
						obj.val = opt.text();
						obj.index = opt.index();
						obj.placeholder.text(obj.val);

                        if(obj.selColor != null) {
                         obj.dd.removeClass(obj.selColor);
                        };


                        obj.dd.addClass(opt.children().attr('class'));
                        obj.selColor = opt.children().attr('class');
                        rc.readBands(rc.bands);
                        
                        
                        
//                        if(obj.selColor === "gold"){
//                            
//                            var g = Snap().paper.gradient("l(0, 0, 0, 1)#4c462d-#ccb266-#4c462d");
//                            Snap(obj.svgId).attr('fill', g);
//                            
//                        } else if (obj.selColor === "silver"){
//                                   
//                            var g = Snap().paper.gradient("l(0, 0, 0, 1)#3c3c3c-#b9b9b9-#3c3c3c");
//                            Snap(obj.svgId).attr('fill', g);
//                            
//                        } else {
//                            Snap(obj.svgId).attr('fill', opt.children().css("background-color"));
//                        }
                        
                        applyColor(obj, opt.children().css("background-color"));
                        
                        clearDrops();
                        return false;
                        

                    });

				},
				getValue : function() {
					return this.val;
				},
				getIndex : function() {
					return this.index;
				}
			}


//main function called on onload of body.
//makes rescalc object
this.mainResSort = function(){
    rc = new resCalc();
    console.log("rc has been created")
    console.log(Snap);
    $(function() {


                rc.linkUi();
				$(document).click(function() {
					// all dropdowns
					$('.wrapper-dropdown-1').removeClass('active');
				});

			});

    $("#r-value").submit(function(e){
        clearDrops();
        e.preventDefault();
        console.log($( "input[type=text][name=r-value]" ).val());
        console.log("submit");
        rc.setBands(rc.guts($( "input[type=text][name=r-value]" ).val()));
        
        
    })




      Snap.load("https://cdn.shopify.com/s/files/1/0698/2265/files/Resistor.svg?5244623991665678927", function(f){
          resSvg = Snap("#resistor-svg-wrapper");
            console.log(f);
          resSvg.append(f);
          resSvg.attr("width", "100%")
        	//console.log("Hello!!!!");

        });



};

function resCalc() {

    var regexIn  = /^(?!\d{4})([1-9]\d?\.?\d?\d?)([r|R|m|M|k|K|g|G])?$/;
    this.bands   = [];
    var numBands = 4;
    var ddPre    = "dd";
    var fCount = 0;



    this.readBands = function(bands){

         var allSet = true;

        for(var i = 0; i < bands.length; i++){

            let col = bands[i].selColor;

            if(col === null){
                allSet = false;
            }

        }

//         console.log(allSet);

         if(allSet){

             $( "input[type=text][name=r-value]" ).val(rc.bandToNum())


         }
     }
    //
    this.linkUi    = function() {

        for(var i = 0; i < numBands; i++)
            {

                this.bands[i] = new DropDown($("#" + ddPre + (i + 1).toString()));
                this.bands[i].svgId += (i+1);

            }


    };

    this.setBands  = function(classes){
        if(classes === null){
            return null;
        }
        
        if(classes[3] === undefined) {
            console.log("ERROR EXCEEDS MAX VALUE");
                alert("Try a smaller resistor value!");
            return "Failed";
        } else {
        for(var i = 0; i < this.bands.length; i++){

            //console.log(this.bands[i].dd);
            if(this.bands[i].selColor != null) {
                this.bands[i].dd.removeClass(this.bands[i].selColor);
                this.bands[i].selColor = null;

            };


            //console.log(classes[i])
            this.bands[i].dd.addClass(classes[i]);

            this.bands[i].selColor = classes[i];
            this.bands[i].dd.val   = this.bands[i].selColor
            this.bands[i].placeholder.text(this.bands[i].dd.val);

            //Snap(this.bands[i].svgId).attr('fill', this.bands[i].dd.css("background-color"));
            
            applyColor(this.bands[i], this.bands[i].dd.css("background-color"));


        }


        return "Success";

        }
    }

    this.bandToNum = function(){

        var result = null;
        var firstThree = "";
        var fourth;
        var wholeNum;

        for(var i = 0; i < this.bands.length; i++) {

            var tempVal = this.bands[i].selColor;

            if(i < 3){

                for(x in intBand){
                    if(tempVal === intBand[x]){
                        tempVal = x;
                    }
                }

                firstThree += tempVal;

            } else if (i === 3) {

                for(x in mulBand){
                    if(tempVal === mulBand[x]){
                        tempVal = x;
                    }
                }

                fourth = tempVal

            }

        }

        wholeNum = Math.floor((firstThree * fourth) * 100) / 100;

      	//Below is orginal. Has weird rounding errors. (RedRedRedGold)ß
      	//wholeNum = firstThree * fourth;

       //console.log(firstThree);
      //  console.log(fourth);
      //  console.log(wholeNum);
        if(wholeNum < 1000) {
            return (wholeNum.toString() + "R")
        } else if (wholeNum < 1000000) {
            return (wholeNum / 1000).toString() + "K"
        } else if (wholeNum < 1000000000){
            return (wholeNum / 1000000).toString() + "M"
        } else if (wholeNum >= 1000000000){
            
            return (wholeNum / 1000000000).toString() + "G"
        }



    }

    this.guts      = function(data){

            var lookForSpaces = data;
            var noSpaces = "";
            var maxLength = 5;
            var colors = [];
            var tempIn = regexIn.exec(data);

            while(lookForSpaces.split("").indexOf(" ") != -1){
              let temp = lookForSpaces.split(" ");


              for(let i = 0; i < temp.length; i++){

                noSpaces += temp[i];

              }

              lookForSpaces = noSpaces;

            }



            data = lookForSpaces;




            if(tempIn == null) {
                console.log("ERROR INVALID VALUE SYNTAX");
                alert("That doesn't look like a resistor value!");
                return null;
            } else {
              var tempNum = tempIn[1];

              if(tempIn[2] != undefined) {
              var tempLet = tempIn[2].toUpperCase();
            } else {
              var tempLet = "R";
            }

              tempNum = tempNum.toString();

              if(tempNum.indexOf('.') === -1 && tempNum.length < 4) {

                tempNum += '.';


              }
              //check for a decimal(if none add one)
              //Pad out resistor bands with zeros

              if(tempNum.length < maxLength){



                while(tempNum.length < maxLength - 1){
                  tempNum += "0";
                }

              }



                //firstThreeColors()

                numerator = letterVal[tempLet];
                denominator = Math.pow(10, tempNum.split("").reverse().indexOf("."));
                fourthband = numerator / denominator;

                //fourColor()

                tempNum = tempNum.split(".");
                tempNum = (tempNum[0] + tempNum[1]).toString().split("");


                for(let i = 0; i < tempNum.length; i++) {

                    colors[i]= intBand[tempNum[i]];
                }



                colors[3] = mulBand[fourthband];
                colors[4] = "Brown";


            return colors;





         };






    };
};
