var linenumber = (function() {
	var counter = 0; //counter starts at 1...

	return function(){ counter++; return counter }
})()

function appendText() {

	appendText.clear = function() {
		while(maintext.firstChild){
			maintext.removeChild(maintext.firstChild);
		}
	}


	function load(){
		if (document.getElementById("maintext") == undefined) {
			let body = document.getElementsByTagName("body")[0];
			var input = document.createElement("input");
			var label = document.createElement("label");
			var wrapper = document.createElement("div");
			var div =	document.createElement("div");

			var hiderdiv = document.createElement("div");
			var hidertext = document.createTextNode("<");

			wrapper.id = "maintextwrapper";
			div.id = "maintext";
			div.className = "maintext";

			hiderdiv.id = "maintextHiderDiv"
			hiderdiv.className = "local"

			input.type = "checkbox";
			input.id = "maintextHider";
			input.checked = true;

			label.setAttribute("for","maintextHider");
			label.setAttribute("onClick","appendText.toggle();");
			label.appendChild(hidertext);

			wrapper.appendChild(div);
			hiderdiv.appendChild(input);
			hiderdiv.appendChild(label);
			body.appendChild(hiderdiv);
			body.appendChild(wrapper);

		}
		maintext.style.visibility = "visible";
		init.style("styles/debugtext.css");
	}

	appendText.toggle = function(){
		isHidden = (!maintextHider.checked);
		maintext.style.visibility = (isHidden) ? "visible" : "hidden";
	}


	if (document.getElementById("maintext") == undefined) {
		console.log("no div, aborting")
		//return;
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