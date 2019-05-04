iT = 0;
function appendText(i,c) {
	// terminates debug messages if debug
	if (c){
		var f = c.includes("debug");
		if ((f) && (!debug)) { return; }
	}

	var text = i;
	var textClass = evenOdd(iT);
	if (c){ textClass = textClass + " " + c; }


	
	var node = document.createElement("p");
	var textnode = document.createTextNode(text);
	var tsNode = document.createElement("span");

	var d = new Date();

	var hours = addZero(d.getHours());
	var minutes = addZero(d.getMinutes());
   var seconds = addZero(d.getSeconds());

	var tsText = document.createTextNode("[" + hours + ":" + minutes + ":" + seconds + "] ");


	node.setAttribute("id",iT);
	node.setAttribute("class",textClass);
	tsNode.setAttribute("class","timestamp");

	tsNode.appendChild(tsText);
	node.appendChild(tsNode)
	node.appendChild(textnode);


	document.getElementById("maintext").appendChild(node);

	iT = iT + 1;
}

function clearText() {
	while(maintext.firstChild){
		maintext.removeChild(maintext.firstChild);
	}
}
