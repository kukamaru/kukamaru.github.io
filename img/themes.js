

const themes = [
{ 

	name:"light",

	bg: 0,
	debug: 2,
	css: [ 
		{
			field: "--background-color",
			val: "white"
		},

		{
			field: "--buttonBackgroundColor",
			val: "white"
		},

		{
			field: "--active-bar",
			val: "blueviolet"
		},

		{
			field: "--stopped-bar",
			val: "indigo"
		},

		{
			field:"--bar-completing",
			val:"green"
		},

		{
			field:"--font-family",
			val:"unibody"
		},

		{
			field:"--text-color",
			val:"black"
		},

		{
			field:"--font-family-emphasis",
			val:"unibody-caps"
		}
	]


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
			field: "--buttonBackgroundColor",
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
			field: "--buttonBackgroundColor",
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