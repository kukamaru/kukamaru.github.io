var backgrounds = [

{ 
	name: "water",
	src: "img/water1_512.jpg",
	css: [
		{
			field: "--background-attachment",
			val: "auto"
		},
		{
			field: "--background-size",
			val: "auto"
		}
	]
},


{
	name: "linen",
	src: "img/stressed_linen.png",
},

{
	name: "inverted water",
	src: "img/inverted_water.jpg",
},
{
	name: "slabs annie spratt",
	src: "img/slabs.jpg"
},
{
	name: "curved",
	src: "img/curved.jpg",
	css: [
		{
			field: "--background-attachment",
			val: "fixed"
		},
		{
			field: "--background-size",
			val: "cover"
		}
	]
}
];


backgrounds.url = function(i) { 
	return "url(" + this[i].src + ")";
}