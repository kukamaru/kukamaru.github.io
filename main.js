// loops Main function at 11ms rate
var myVar = setInterval(myTimer, 11);

//defaults
var msVisible = true;
var timeStamps = true;

//globals
var timerRunning = false;
var timersRunning = 0;
var windowState = false;

var timerOrigin;


/*sounds*/
	/*
	var sounds = [ { 
		soundName: "eggsound",
		soundFile: 'audio/eggsound1.mp3',
		}
	]
	;
	*/
/* Main Function */
	function myTimer() {
		var d = new Date();
		if (timerRunning){
			document.getElementById("timediv").style.background = "green";
		}
		else {
			document.getElementById("timediv").style.background = "black";
		}

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

/** EGGTIMER **/
	function eggTimer(eS,eM,eH) {
		if (eH == undefined) { eH = 0; }
		if (eM == undefined) { eM = 0; }
	    var cookingTime = ( eS * 1000 ) + ( eM * 60 * 1000) + ( eH * 60 * 60 * 1000 );

		appendText("egg timer starting, " + cookingTime + " milliseconds");

		startTimer(cookingTime,"egg",0);

		menuHide();
	}

	var timerID = 0;
	function startTimer(T,text,soundID) {
		timerID++;

		var d = new Date();
		var endTime = d + T;

		appendText("expecting alarm at" + endTime);
		appendText("T = " + T);

		timersRunning++;
		timerRunning = true;

		newBar(timerID,T,text);
		setAlarm(timerID,T,text,soundID);
	}
/** ALARM CORE FUNCTION **/
	function setAlarm(ID,T,text,soundID) {
			setTimeout(function(){alarm(ID,text,soundID);}
			,T)
	}
	function alarm(ID,text,soundID) {
		appendText(text,"alert");
		appendText("playing sound: " + soundID);



		/** not actually responding to soundID **/
		var audio = new Audio('audio/eggsound1.mp3');
		audio.play();

		hideBar(ID);

		timersRunning--;
		if (timersRunning == 0) { timerRunning = false }

		appendText(timersRunning + " alarms remain","status")
	}
/** BARS **/
	function newBar(ID,T,text) {
		var div = document.createElement('div');
		var parent = document.getElementById('bars');

		var label = document.createElement('p');

		divid = "bar" + ID;

		text = text + " " + ID + " " + T;

		label.innerHTML = text;

		div.setAttribute('class',"bar");
		div.setAttribute('id', divid);
		div.appendChild(label);

		parent.appendChild(div);
	}
	function hideBar(ID) {
		var div = document.getElementById('bar'+ID);
		var parent = document.getElementById('bars');
		parent.removeChild(div);
	}

/* Buttons and menu */
	function button() {
		appendText("button pressed");

		var start = Date.now();
		console.log("button pressed: " + start);
		setTimeout(function(){ 
			console.log("time elapsed");
			alarm("boing","alarm.mp3"); 
		}, 2000)
	}
	function button2() {
		appendText("button2 pressed");
	}

	function menuShow(i){
		var bg = document.getElementById("menuwrapper");
		var focus = document.getElementById(i);

		windowState = i;

		bg.style.visibility = "visible";
		bg.style.background = "var(--wrapperbg-color)"
		focus.style.visibility = "visible";
	}

	function menuHide(){
		var bg = document.getElementById("menuwrapper");
		var focus = document.getElementById(windowState);

		windowState = false;

		bg.style.background = "rgba(0,0,0,0)";
		focus.style.visibility = "hidden";
		setTimeout(function(){bg.style.visibility = "hidden";}, 250)
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

/* Text Stuff */
	var iT = 0; /* Span ID for text */


	function clearText() {
		while(maintext.firstChild){
			maintext.removeChild(maintext.firstChild);
		}
		iT = 0;
	}

	function appendText(i,c) {
		var text = i;
		var textClass = evenOdd(iT);
		if (c){	textClass = textClass + " " + c; }

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
	function isEven(x) { return (x%2)==0; }
	function evenOdd(x) { if (isEven(x)){return "even";} else {return "odd";} }

/* Cookies */
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
