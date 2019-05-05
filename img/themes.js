
const themes = [
{ 

	name:"light",

	bg: 0,
	debug: 2,
	colors: [ 
		{
			css: "--background-color",
			val: "white"
		},

		{
			css: "--buttonBackgroundColor",
			val: "white"
		},

		{
			css: "--active-bar",
			val: "blueviolet"
		},

		{
			css: "--stopped-bar",
			val: "indigo"
		},

		{
			css:"--bar-completing",
			val:"green"
		}
	]


	},

	{

	name: "dark",

	bg: 1,
	debug: 0,
	colors: [ 
		{
			css: "--background-color",
			val: "black"
		},

		{
			css: "--buttonBackgroundColor",
			val: "black"
		},

		{
			css: "--active-bar",
			val: "red"
		},

		{
			css: "--stopped-bar",
			val: "darkred"
		},

		{
			css:"--bar-completing",
			val:"orange"
		}
	]
}

];