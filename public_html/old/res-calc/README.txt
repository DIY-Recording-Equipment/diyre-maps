ResCalc8 is live 08-01-2017

For ResCalc7 and improved css:


 
 
 

DONE:
css:
 - fix maximum enterable value issue
 - add gradients to bands on the resistor svg
 - no padding in-between dropdown items
 
  - only one dropdown open at a time
  - text-field submit closes all dropdowns



use index and rescalc 6


Snap("#band_1").attr("fill", "#FFF")

make sure selColor is set via clicking!!! !!!


for bands back to res val:

    generate number from bands:
        read first three bands as int
        multiply by fourth
    Assess what letter suffix to append:
        -if it ends with fewer than three zeros 
            true: append "R" to val
            false:
                -if more than six zeros
                    true:  append "m" remove six zeros to val
                    false: append "k" remove three zeros to val
    place in #r-value with .val()
        
    



var paramsString = window.location.href;
            var searchParams = new URLSearchParams(paramsString);
            console.log(searchParams.has("r-value"));
            if(searchParams.has("r-value") === true) { // true
            
            
            rc.setBands(rc.guts(searchParams.get("r-value")));   
            }
            
             $("#r-value").submit(function(data){
        
        setTimeout(function(){
        if(data != undefined && data.length > 0) {
            
            
        }}, 200
    )});

setClass function


regex.exec() works in a weird stateful way means it only works every other time. Does this mean I could call it at the end to reset it? SOLVED: Was the g and m regex flags

Front end shit from now:

Peter made the whole res calc and he hard coded the HTML layout. The css classes are all correct I believe but his javascript is hard coded to the layout as well. I need to fix it so that all five dropdowns work.














Backend dev from ages ago:

Resistor calculator where you enter the value of the resistor and it shows you
what the resistor looks like. This will only work because we get to make safe
assumptions about what the resistor will look like:

5 bands.

last band is always brown

special parser for the 4 bands.

bands 1 - 3 are digits

band 4 is multiplier.

47k

parse to:

47 | k
