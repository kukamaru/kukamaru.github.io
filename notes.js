function notes() {
	var div = document.getElementById("notesdiv");
	var n = document.getElementById("notes");

	notes.show = function(){
		div.style.right = "200px";
	}

	appendText(n.value,"debug yellow");
}