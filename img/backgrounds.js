var backgrounds = [

{ 
	name: "water",
	src: "img/water1_512.jpg",
},


{
	name: "linen",
	src: "img/stressed_linen.png",
},

{
	name: "inverted water",
	src: "img/inverted_water.jpg"
},
{
	name: "slabs annie spratt",
	src: "img/slabs.jpg"
},
{
	name: "curved",
	src: "img/curved.jpg"
}


];


backgrounds.url = function(i) { 
	return "url(" + this[i].src + ")";
}