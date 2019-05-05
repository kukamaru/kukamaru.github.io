function notes() {
	var div = document.getElementById("notesdiv");
	var n = document.getElementById("notes");

	notes.show = function(){
		div.style.right = "3vw";
		div.style.top = "40vh";
	}

	appendText(n.value,"debug yellow");
}