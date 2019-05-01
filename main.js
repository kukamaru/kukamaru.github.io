// loops Main function at 11ms rate
var myVar = setInterval(myTimer, 11);

//defaults
var msVisible = true;
var timeStamps = true;

//globals
var timerRunning = false;
var timersRunning = 0;
var windowState = false;
var activeTimers = [];
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

		renderBars();
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
		var d = new Date(); 
		var fms = d.valueOf() + T;
		var f = new Date(fms);
		
		activeTimers.push({
			ID:timerID,
			start:d,
			finish:f,
			duration:T,
			active:true
		});

		appendText("expecting alarm at " + f);
		appendText("T = " + T);

		timersRunning++;
		timerRunning = true;

		newBar(timerID,text);
		setAlarm(timerID,T,text,soundID);

		timerID++;
	}
/**ALARM CORE FUNCTION **/
	function setAlarm(ID,T,text,soundID) {
			setTimeout(function(){alarm(ID,text,soundID);}
			,T)
	}

	function alarm(ID,text,soundID) {
		appendText(text,"alert");
		appendText("playing sound: " + soundID);
		
		activeTimers[ID].active = false;

		/** not actually responding to soundID **/
		var audio = new Audio('audio/eggsound1.mp3');
		audio.play();

		hideBar(ID);

		timersRunning--;
		if (timersRunning == 0) { timerRunning = false }

		appendText(timersRunning + " alarms remain","status")
	}
/** BARS **/
	function newBar(ID,text) {
		var div = document.createElement('div');
		var progressdiv = document.createElement('div');
		var parent = document.getElementById('bars');


		divID = "bar" + ID;
		progressID = "progress" + ID;
		// text = text + " " + ID + " " + T;

		var label = document.createElement('p');
   	label.innerHTML = text;

		div.setAttribute('class',"bar");
		div.setAttribute('id', divID);
		progressdiv.setAttribute('class',"progressbar")
		progressdiv.setAttribute('id', progressID)

		label.setAttribute('id',"barlabel" + ID)

		div.appendChild(label);
		div.appendChild(progressdiv);

		parent.appendChild(div);
	}
	function hideBar(ID) {
		var div = document.getElementById('bar'+ID);
		var bar = document.getElementById('progress' + ID)
		var parent = document.getElementById('bars');

		var label = document.getElementById('barlabel' + ID);


		label.style.color = "rgba(0,0,0,0)";
		bar.style.height = "0px";
		div.style.height = "0px";
		div.style.marginBottom = "0px";


		setTimeout(function(){parent.removeChild(div);},10000); 
	}
 //renderbars is looped from main function
	function renderBars() {
		now = new Date().valueOf();
		num = activeTimers.length;

		for (i = 0; i < num; i++){
			start = activeTimers[i].start.valueOf();
			end = activeTimers[i].finish.valueOf();

			var elapsed = now-start;
			var total = end-start;

			elapsedFraction = (elapsed/total*100);
			if (elapsedFraction > 100) { elapsedFraction = 100 }
			widthPercent = elapsedFraction + "%";

			bar = document.getElementById("progress" + activeTimers[i].ID);

			if (bar != undefined){ 
				bar.style.width = widthPercent;
				if (elapsedFraction > 80) bar.style.background = "red";
			}
		}
	}


/* Buttons and menu */
	function button() {
		appendText("button pressed","status");
		eggTimer(3);
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
		timeStamps = checkBox.checked
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

		var node = document.createElement("p");
		var textnode = document.createTextNode(text);

		node.setAttribute("id",iT);
	   node.setAttribute("class",textClass);

	   if (timeStamps){
			var d = new Date();

			hours = addZero(d.getHours());
			minutes = addZero(d.getMinutes());
			seconds = addZero(d.getSeconds());

			ts = "[" + hours + ":" + minutes + ":" + seconds + "] ";

			var tsText = document.createTextNode(ts);
			var tsNode = document.createElement("span");
			tsNode.appendChild(tsText);
			tsNode.setAttribute("class","timestamp");

			node.appendChild(tsNode)
		}
		node.appendChild(textnode);

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
