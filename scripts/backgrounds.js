var backgrounds = [

{ 
	name: "water",
	src: "bin/img/water1_512.jpg",
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
	src: "bin/img/stressed_linen.png",
},

{
	name: "inverted water",
	src: "bin/img/inverted_water.jpg",
},
{
	name: "slabs annie spratt",
	src: "bin/img/slabs.jpg"
},
{
	name: "curved",
	src: "bin/img/curved.jpg",
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