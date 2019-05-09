function makeTheme(inputTheme) {

	var defaultTheme = { 

	name:"light",

	bg: 0,
	debug: 2,
	css: thing1.css(),
	isTheme: true

	}

	if (inputTheme) {
		var newTheme = Object.assign(defaultTheme, inputTheme);
		return newTheme;
	}

	else return defaultTheme;
}


function styleCssName(word){
	if (typeof word !== "string") { return false }
	function upperToHyphenLower(match, offset, string) {
    	return (offset > 0 ? '-' : '') + match.toLowerCase();
  	}

	var re = /[A-Z]/g;	
	word = "--" + word.replace(re,upperToHyphenLower);
	return word;
}


//makes new css object
function makeCSS(){
	var defaultCSS = {};
	Object.defineProperties(defaultCSS,{
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
			value: "white",
			writable: true,
			enumerable: true
		},
		
		"buttonBackgroundColor": {
			value: "white",
			writable: true,
			enumerable: true
		},

		
		"activeBar": {
			value: "blueviolet",
			writable: true,
			enumerable: true
		},

		
		"stoppedBar": {
			value: "indigo",
			writable: true,
			enumerable: true
		},

		
		"barCompleting": {
			value:"green",
			writable: true,
			enumerable: true
		},

		
		"fontFamily": {
			value:"unibody",
			writable: true,
			enumerable: true
		},

		
		"textColor": {
			value:"black",
			writable: true,
			enumerable: true
		},

		
		"fontFamilyEmphasis": {
			value:"unibody-caps",
			writable: true,
			enumerable: true
		}
	});


	return defaultCSS;
}


const thing1 = makeCSS()


const themes = [
{ 

	name:"light",

	bg: 0,
	debug: 2,
	css: thing1.css()
	},

	{

	name: "dark",

	bg: 1,
	debug: 0,
	css: [ 
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
	]
	},

	{

	name: "vintage classic",

	bg: 1,
	debug: 0,
	css: [ 
		{
			field: "--background-color",
			val: "lightyellow"
		},

		{
			field: "--button-background-color",
			val: "yellow"
		},

		{
			field: "--active-bar",
			val: "orange"
		},

		{
			field: "--stopped-bar",
			val: "black"
		},

		{
			field:"--bar-completing",
			val:"green"
		},

		{
			field:"--font-family",
			val:"times new roman"
		},

		{
			field:"--font-family-emphasis",
			val:"times new roman"
		}
	]
	},


	{

	name:"local",

	bg: 4,
	debug: 0
	
	}



];