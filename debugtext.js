iT = 0;
function appendText(i,c) {
	var div = document.getElementById("maintext");

	div.style.visibility = "visible";
	init.style("debugtext.css")

	appendText.toggle = function(){
		isHidden = (div.style.visibility == "hidden");
		div.style.visibility = (isHidden) ? "visible" : "hidden";
	}

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

	setTimeout(function(){
		node.setAttribute("class","faded");
	},15000) // fade after 15 secs

	iT = iT + 1;
}

function clearText() {
	while(maintext.firstChild){
		maintext.removeChild(maintext.firstChild);
	}
}
