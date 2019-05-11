function notes() {

	notes.show = function(){
		notesDiv.style.right = "3vw";
		notesDiv.style.top = "40vh";

		appendText("localstorage " + localStorage.getItem('notes'));
		notesInput.value = localStorage.getItem('notes');

	}
	notes.changed = function(){
		appendText(notesInput.value,"debug yellow");

		localStorage.setItem('notes', notesInput.value);
	}

}