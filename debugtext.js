iT = 0;
function appendText(i,c) {
	if ((c == "debug") && (!debug)) { return; }
	var text = i;
	var textClass = evenOdd(iT);
	if (c){	textClass = textClass + " " + c; }

	var node = document.createElement("p");
	var textnode = document.createTextNode(text);

	node.setAttribute("id",iT);
	node.setAttribute("class",textClass);


	var d = new Date();

	var hours = addZero(d.getHours());
	var minutes = addZero(d.getMinutes());
   var seconds = addZero(d.getSeconds());

	var ts = "[" + hours + ":" + minutes + ":" + seconds + "] ";

	var tsText = document.createTextNode(ts);
	var tsNode = document.createElement("span");
	tsNode.appendChild(tsText);
	tsNode.setAttribute("class","timestamp");

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
