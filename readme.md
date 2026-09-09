# Build Map Documentation

The build map is a static webpage/app that loads in an SVG and a corresponding datafile (.JSON file) and makes an interactive build map out of them.

1. Make SVG with structure laid out below  
2. Make data file (using Build Map Data Editor)  
   1. Part data (all identifiers must be unique)  
   2. PCB data  
   3. Side data  
   4. Steps (Bag numbers)  
   5. Links back to build guide  
3. Prep and correct any discrepancies between SVG and Data file.

The file needs to be hosted on a http server to work. Opening index.html will result in the page never loading.

You shouldn’t need to touch the code. You may have more than one DB in the SVG but they must have unique names. The whole thing is set up to be data-entry more than any unique coding.

#### Build Map Folder Structure:

* index.html:  
  * This is the main page for the app. Has a small inline script that initializes the app. If your SVG and Data file have conflicts it will show up in this code. In fact: due to a console.log on line 95 of the file that I’ve never uncommented, you can open the in-browser dev-tools and see exactly where in the list it gave up which should tell which entry in the SVG or JSON is either missing or malformed.  
* bg-style.css:  
  * All the custom css for the app.  
* bg-tools.js  
  * The code that tracks the state of the app.  
* assets (folder)  
  * data.json  
    * Must have this filename (all lower case)  
    * Must have an entry for every named object that is in the SVG  
    * JSON structure  
      * coms  
        * Contains objects for each named object in SVG  
          * "IC5_2_Socket": {  
                  "type": "COM",  
                  "val": "DIP8",  
                  "step": "5",  
                  "alt-name": "IC5_2 Socket"

             	 },  
      * [Further notes on JSON Structure](#further-notes-on-data.json-structure:)  
      * Steps  
        * “Numbers” Keys have for their values a string that contains the link back to the Assembly Guide.  
        * Numbers with the prefix “T” have an array as their value where index 0 is the name of the step and index 1 is the description.

#### Further Notes on data.json structure:

Every object in coms object must be named in SVG. There can be no duplicate names. There are different “types” that must be labeled as such and follow certain naming conventions. Suffix number separated with a “-” unless it is of type “PCB”

BG:

	SVG  side: A Group containing all svg data for the background of the map.  
	Data side: has one attribute called “type” that must be “BG”

    "BG": {  
      "type": "BG"  
    },  
    "BG-2": {  
      "type": "BG"  
    },  
    "BG-3": {  
      "type": "BG"  
    },

SIDE  
SVG  side: A Group containing the BG and Parts Groups for a SIDE of a PCB.  
Must have Prefix of either “TOP” or “BOT” (short for bottom).   
	Data side: has one attribute called “type” that must be “SIDE”

    "BOT": {  
      "type": "SIDE"  
    },  
    "BOT-2": {  
      "type": "SIDE"  
    },  
    "BOT-3": {  
      "type": "SIDE"  
    },  
...

...  
    "TOP": {  
      "type": "SIDE"  
    },  
    "TOP-2": {  
      "type": "SIDE"  
    },  
    "TOP-3": {  
      "type": "SIDE"  
    },  
COM:

SVG  side: A Group containing all data svg for the background of the map.  
	Data side: has four attributes

* type  
  * Must be “COM”  
* val  
  * Value to be displayed in step list  
* step  
  * step number that corresponds the the steps object at the end of data.json  
* alt-name  
  * Short for “alternate name” this allows you to re format the display name of an entity that might be named something else in the SVG. “alt-name” is what is used for the alphanumeric sorting of the parts in the steps in the list.  Useful for replacing certain underscores with spaces and conforming SVG names to those of the conventions used in sorting them in the step. 

"IC5_2_Socket": {  
      "type": "COM",  
      "val": "DIP8",  
      "step": "5",  
      "alt-name": "IC5_2 Socket"  
    },

PCB:  
	Must be named either MB or DB. There can be only on MB but you may have multiple DBs however there is no dash used to separate suffix numbers in the key name. So it is “DB2” instead of “DB-2”. 

"DB": {  
      "type": "PCB"  
    },  
    "DB2": {  
      "type": "PCB"  
    },

Edit Index.html

1. Change <tiltle> and <h3> to name of kit  
2. Change file name of svg

#### A note on step list sorting:

Each step is sorted by a rather complicated criteria that accounts for all the various - or _ or Refdes conventions we employ. This is usually the thing I have to adjust every time we make one of these as we are often adding parts that necessitate changes to our conventions.

This code lives in bg_tools.js and is a sort that happens at line 423. The sort function definition is at line 683 and is what you would want to change to actually alter the sort.

### [**Build Map Data Editor](https://github.com/littlestray/diyre-build-map-data-editor.git)**

	This spits out a template JSON file from the named parts in your SVG. You load in the prepped SVG (Jesse has info on that. Refer to the SVG structure of the DUO). 

Hierarchy:

* KIT (Required SVG group)  
  * MB (PCB)  
    * TOP (SIDE)  
      * BG  
      * Parts   
        * Refdeses of parts in svg (Pars)  
    * BOT (SIDE)  
      * BG  
      * Parts  
        * Refdeses of parts in svg  
  * DB (PCB)  
    * TOP  
      * BG  
      * Parts  
        * Refdeses of parts in svg  
    * BOT  
      * BG  
      * Parts  
        * Refdeses of parts in svg