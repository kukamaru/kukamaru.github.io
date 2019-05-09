function makeTheme(inputTheme) {

	var newCSS = makeCSS(inputTheme.css);

	var defaultTheme = { 

	name:"light",

	bg: 0,
	debug: 2,
	css: newCSS,
	isTheme: true

	}

	if (inputTheme) {
		var newTheme = Object.assign(defaultTheme, inputTheme);
		return newTheme;
	}

	else return defaultTheme;
}

var DEFAULTTHEMECSS = {
			backgroundColor:"white",
			buttonBackgroundColor:"white",
			activeBar:"blueviolet",
			stoppedBar:"indigo",
			barCompleting:"green",
			fontFamily:"unibody",
			textColor:"black",
			fontFamilyEmphasis:"unibody-caps"
}
var doink = makeCSS();



//makes new css object
function makeCSS(input){

	function CSS(input){

		function styleCssName(word){
			if (typeof word !== "string") { return false }
				function upperToHyphenLower(match, offset, string) {
					return (offset > 0 ? '-' : '') + match.toLowerCase();
				}

				var re = /[A-Z]/g;	
				word = "--" + word.replace(re,upperToHyphenLower);
				return word;
		}

		var cssObj = (input) ? input : {} ;

		Object.defineProperties(cssObj,{
			"css": {
				value: function(){
					var values = Object.entries(this);

					for (var i = 0;i < values.length;i++){
						values[i][0] = styleCssName(values[i][0]);
					}
					return values;
				},
				writable:false,
				enumerable: false
			},
			"backgroundColor": {
			//	value: "white",
				writable: true,
				enumerable: true
			},
			
			"buttonBackgroundColor": {
			//	value: "white",
				writable: true,
				enumerable: true
			},

			
			"activeBar": {
				//value: "blueviolet",
				writable: true,
				enumerable: true
			},

			
			"stoppedBar": {
			//	value: "indigo",
				writable: true,
				enumerable: true
			},

			
			"barCompleting": {
			//	value:"green",
				writable: true,
				enumerable: true
			},

			
			"fontFamily": {
			//	value:"unibody",
				writable: true,
				enumerable: true
			},

			
			"textColor": {
			//	value:"black",
				writable: true,
				enumerable: true
			},

			
			"fontFamilyEmphasis": {
			//	value:"unibody-caps",
				writable: true,
				enumerable: true
			}
		});

		return cssObj;
	}

	outputCSS = CSS(input);

	outputCSS = Object.assign(DEFAULTTHEMECSS, outputCSS)	

	return outputCSS;

}

function prepThemes(){
	for (var i = 0;i < themes.length;i++){
		themes[i] = makeTheme(themes[i]);
	}
}


var themes = [
{ 

	name:"light",

	bg: 0,
	debug: 2,
	css: doink

	},

	{

	name: "dark",

	bg: 1,
	debug: 0//,
	/*css: [ 
		{
			field: "--background-color",
			val: "black"
		},

		{
			field: "--button-background-color",
			val: "black"
		},

		{
			field: "--active-bar",
			val: "red"
		},

		{
			field: "--stopped-bar",
			val: "darkred"
		},

		{
			field:"--bar-completing",
			val:"orange"
		},

		{
			field:"--font-family",
			val:"unibody"
		},

		{
			field:"--text-color",
			val:"white"
		},

		{
			field:"--font-family-emphasis",
			val:"unibody-black"
		}
	]*/
	},
	

	{

	name:"local",

	bg: 3,
	debug: 0,
	css: {
		buttonBackgroundColor: "white",
		activeBar: "lime"
	}

	
	},


	{

	name:"local",

	bg: 4,
	debug: 0,
	
	}



];

