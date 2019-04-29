var myVar = setInterval(myTimer, 11);
var msVisible = true;
var timeStamps = true;

/* Milliseconds Checkbox */
function msVisCheck() {
	var checkBox = document.getElementById("msCheck");
	var text = document.getElementById("text4");
	var div = document.getElementById("timediv");

	var delay = 200;

	if (checkBox.checked == true) {	
		text.style.visibility = "visible";
		msVisible = true;
		text.style.color = "rgba(255,255,255,1)";
		div.style.width = "160px";

	}
	else { 
		msVisible = false;
		text.style.color = "rgba(255,255,255,0)";
		div.style.width = "130px";
		setTimeout(function(){
			text.style.visibility = "hidden";
		}, delay);
		

	}
}

/* Timestamp Checkbox */
function tsVisCheck() {
	var checkBox = document.getElementById("tsCheck");
	if (checkBox.checked == true) {	
		timeStamps = true;
	}
	else { 
		timeStamps = false;
	}
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function addZeroMs(i) {
  if (i > 999){
  	i = 999;
  }
  else if (i < 10) {
    i = "00" + i;
  }
  else if (i < 100) {
  	i = "0" + i;
  }
  return i;
}

function myTimer() {
	var d = new Date();

	hours = addZero(d.getHours());
	minutes = addZero(d.getMinutes());
	seconds = addZero(d.getSeconds());
	ms = addZeroMs(d.getMilliseconds());

	document.getElementById("text1").innerHTML = "" + hours;
	document.getElementById("text2").innerHTML = ":" + minutes;
	document.getElementById("text3").innerHTML = ":" + seconds;

	if(msVisible == true){
		document.getElementById("text4").innerHTML = "." + ms;
	}
}

function button() {
	appendText("button pressed");

	var start = Date.now();
	console.log("button pressed: " + start);
	setTimeout(function(){ 
		console.log("time elapsed");
		appendText("BOING:" + start,"alert"); 
	}, 2000)
}



var iT = 0; /* Span ID for text */
function isEven(x) { return (x%2)==0; }
function evenOdd(x) { if (isEven(x)){return "even";} else {return "odd";} }

function clearText() {
	while(maintext.firstChild){
		maintext.removeChild(maintext.firstChild);
	}
	iT = 0;
}

function appendText(i,c) {
	var text = i;
	var textClass = evenOdd(iT);
	if (c){	textClass = " " + c; }

	if (timeStamps){
		var d = new Date();

		hours = addZero(d.getHours());
		minutes = addZero(d.getMinutes());
		seconds = addZero(d.getSeconds());

		ts = "[" + hours + ":" + minutes + ":" + seconds + "]";
		text = ts + " - " + text;
		}

	var node = document.createElement("p");
	var textnode = document.createTextNode(text);

	node.appendChild(textnode);
	node.setAttribute("id",iT);
    node.setAttribute("class",textClass);

	document.getElementById("maintext").appendChild(node);

	iT = iT + 1;
}

/* cookies */
function checkCookies() {
	var text = "";
	appendText("bingo boingo","freeze")
	if (navigator.cookieEnabled == true){
		text = "cookies are enabled";
	}
	else {
		text = "cookies are disabled";
	}
	msVisCheck();

	appendText(text);
}