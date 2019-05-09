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

//makes new css object
function makeCSS(){
	var defaultCSS = {};
	Object.defineProperties(defaultCSS,{
		"css": {
			value: function(){
				//names = Object.getOwnPropertyNames(this);
				values = Object.entries(this);


				//console.log(names);
				//console.log("names");

				//console.log(values);
				//console.log("values");
				return values; 
			},
			writable:false,
			enumerable: false
		},
		"--background-color": {
			value: "white",
			writable: true,
			enumerable: true
		},

		
		"--button-background-color": {
			value: "white",
			writable: true,
			enumerable: true
		},

		
		"--active-bar": {
			value: "blueviolet",
			writable: true,
			enumerable: true
		},

		
		"--stopped-bar": {
			value: "indigo",
			writable: true,
			enumerable: true
		},

		
		"--bar-completing": {
			value:"green",
			writable: true,
			enumerable: true
		},

		
		"--font-family": {
			value:"unibody",
			writable: true,
			enumerable: true
		},

		
		"--text-color": {
			value:"black",
			writable: true,
			enumerable: true
		},

		
		"--font-family-emphasis": {
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