var linenumber = (function() {
	var counter = 0;

	return function(){ counter++; return counter }
})()


function appendText() {

	appendText.clear = function() {
		while(maintext.firstChild){
			maintext.removeChild(maintext.firstChild);
		}
	}


	function load(){
		if (maintext == undefined) {
				// create maintext
		}
		maintext.style.visibility = "visible";
		init.style("debugtext.css");
	}

	appendText.toggle = function(){
		isHidden = (maintext.style.visibility == "hidden");
		maintext.style.visibility = (isHidden) ? "visible" : "hidden";
	}


	if (document.getElementById("maintext") == undefined) {
		console.log("no div, aborting")
		return;
	}

	if (debug) { console.log(arguments); }


	printtext(arguments[0],arguments[1]);

	

	function printtext(i,c){
		var iT = linenumber();

		//run load if first line
		if (iT == 1) { load(); }


		// terminates debug messages if debug isnt active
		if (c){
			var check = c.includes("debug");
			if ((check) && (!debug)) { return; }
		}

		// the node generation.
	
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


		maintext.appendChild(node);

		setTimeout(function(){
			node.setAttribute("class",textClass + " faded");
		},15000) // fade after 15 secs
	}
}