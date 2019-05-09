function makeTheme(inputTheme) {

	var newCSS

	if (inputTheme.css){
		newCSS = makeCSS(inputTheme.css);
	}

	else newCSS = makeCSS();

	var defaultTheme = { 

	name:"light",

	bg: 0,
	debug: 2,
	css: newCSS,
	isTheme: true

	}

	if (inputTheme) {
		var newTheme = Object.assign(defaultTheme, inputTheme);
		newTheme.css = makeCSS(inputTheme.css);
		return newTheme;
	}

	else return defaultTheme;
}


//makes new css object
function makeCSS(input){

		function styleCssName(word){
			if (typeof word !== "string") { return; }
				function upperToHyphenLower(match, offset, string) {
					return (offset > 0 ? '-' : '') + match.toLowerCase();
				}

				var re = /[A-Z]/g;	
				word = "--" + word.replace(re,upperToHyphenLower);
				return word;
		}

		var DEFAULTTHEMECSS = {
			textColor: 							"black",
			clockTextColor:  					"white",

			alarmWindowBackgound:   		"white", 
			backgroundColor: 					"white",

			buttonBackgroundColor: 			"white",
			buttonBorderColor:  				"black",
			buttonTextColor:    				"purple",

			buttonHoverTextColor:   		"blue",
			buttonHoverBackgroundColor: 	"lightyellow",
			buttonHoverBorderColor:       "value", 

			activeBar: 							"blueviolet",
			stoppedBar: 						"indigo",
			barCompleting: 					"green",


			fontFamily: 						"unibody",
			
			fontFamily: 			   		"unibody", 
			fontFamilyEmphasis: 				"unibody-caps"
		}

		var cssObj = {}
		Object.defineProperties(cssObj,{
			"css": {
				value: function(){
					var values = Object.entries(this);

					//1 skips first value, the function
					for (var i = 0;i < values.length;i++){
						values[i][0] = styleCssName(values[i][0]);
					}
					return values;
				},
				writable:false,
				//enumerable: true
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
		
		Object.assign(cssObj, DEFAULTTHEMECSS);
		Object.assign(cssObj, input);

		return cssObj;
	
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

	},

	{

	name: "dark",

	bg: 1,
	debug: 0
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

