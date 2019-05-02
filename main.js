// loops Main function at 11ms rate
var myVar = setInterval(mainLoop, 11);

//defaults
var msVisible;
var timeStamps;

//globals
var timerRunning = false;
var timersRunning = 0;
var windowState = false;
var canSnooze = true;
var activeTimers = [];
var activeAlarms = [];
var timerOrigin;



//sounds

const sounds = [ 
{ 
	soundName: "eggsound",
	src: "audio/eggsound1.mp3",
	looping: false
},


{
	soundName: "jingle",
	src: "audio/jingle.mp3",
	looping: false
},


{
	soundName: "groove",
	src: "audio/groove.mp3",
	looping: true
}
];

/* Cookies + Init */
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
	//debug stuff
	appendText(text);
	appendText("loaded from: " + window.location.href,"status");
	appendText("isLocal " + isLocal());
	if (isLocal()) { initLocal(); }
}

function isLocal() {
	var url = window.location.href;
	return (url != "http://www.utamaru.com/");
}

function initLocal() {
	var body = document.getElementsByTagName("BODY")[0];
	body.style.background = "url(water1_512.jpg)";
	var header = document.getElementById("header");

	var t = document.createTextNode(" (local version)");
	var span = document.createElement("span");
	span.style.color = "var(--alert-color)";

	span.appendChild(t);

	header.appendChild(span);
}

/* Main Function */
function mainLoop() {
	var d = new Date();
	if (timerRunning){
		document.getElementById("timediv").style.background = "var(--active-bar)";
	}
	else {
		document.getElementById("timediv").style.background = "var(--stopped-bar)";
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
function newTimer() {
	form = document.getElementById("newTimer");

	h = form.h.value;
	m = form.m.value;
	s = form.s.value;
	size = form.size.value;
	text = form.text.value;
	soundID = form.sound.value;
	protected = form.protected.value;

	style = size;

	if (form.countdown.checked){ style = "countdown " + style; }
	if (form.inverted.checked){ style = "inverted " + style; }
	if (form.protected.checked){ style = "protected " + style; }


	eggTimer(s,m,h,style,text,soundID);

	form.reset();
}

function eggTimer(eS,eM,eH,style,text,sound) {
	if (eH == undefined) 	{ eH = 0; }
	if (eM == undefined) 	{ eM = 0; }
	if (text == undefined) 	{ text = "eggtimer (undefined)"; }
	if (!sound) 				{ sound = 0; }
	if (!style) { style = "normal"; }

	var cookingTime = ( eS * 1000 ) + ( eM * 60 * 1000) + ( eH * 60 * 60 * 1000 );

	appendText(text + " starting (eggtimer), " + cookingTime + " milliseconds","status");

	startTimer(cookingTime,text,sound,style);
	menuHide();
}

var timerID = 0;

function startTimer(T,text,soundID,style) {
	var d = new Date(); 
	var f = new Date(d.valueOf() + T);

	if (!style) { style = "normal"; }

	activeTimers.push(
	{
		ID: 			timerID,
		active: 		true,
		text:  		text,

		start: 		d,
		finish: 		f,
		duration: 	T,

		style: 		style,
		soundID: 	soundID,
		inverted:   style.includes("inverted"),
		countdown:  style.includes("countdown"),
		protected:  style.includes("protected"), 

	}
	);

	newBar(timerID);
	setAlarm(timerID,T,text,soundID);

	timersRunning++;
	timerRunning = true;
	timerID++;
}
/**ALARM CORE FUNCTION **/
function setAlarm(ID,T,text,soundID) {
	setTimeout(function(){alarm(ID);}
		,T)
}

function alarm(ID) {
	var text = activeTimers[ID].text;
	var soundID = activeTimers[ID].soundID;
	var isLooping = sounds[soundID].looping;

	appendText(text,"alert");
		//appendText("isLooping = " + isLooping);
		//appendText("playing sound: " + sounds[soundID].src + " "+"("+soundID+")");
		
		var audio = new Audio(sounds[soundID].src);
		if (isLooping){
			audio.setAttribute("loop",true);
			audio.play();
			activeAlarms.push(audio);

			alarmWindow(ID);
		}
		else { audio.play(); }

		hideBar(ID);

		activeTimers[ID].active = false;
		timersRunning--;
		if (timersRunning == 0) { timerRunning = false }
		//appendText(timersRunning + " alarms remain","status")
}

function alarmWindow(ID) {
	alarmShow();
	firstAlarm = (activeAlarms.length == 1);

	var div = document.getElementById('alarmWindow');
	var buttondiv = document.getElementById('alarmButtons');
	var bg = document.getElementById('alarmBG');
	var content = document.getElementById('alarmContent');

		if (firstAlarm){ 						//create buttons if first

			var stopButton = document.createElement('button');
			stopButton.setAttribute("onclick","alarmStop()");
			stopButton.setAttribute("id","stopButton");
			stopButton.setAttribute("class","stopButton");
			stopButton.innerHTML = "-- Stop Alarm --";

			if (canSnooze){
				var snoozeButton = document.createElement('button');
				snoozeButton.setAttribute("onclick",'alarmSnooze()');
				snoozeButton.setAttribute("id","snoozeButton");
				snoozeButton.setAttribute("class","snoozeButton");
				snoozeButton.innerHTML = "Snooze Alarm\n(5 minutes)";
			}

			icon = document.createElement('div');
			icon.setAttribute("class","alarmIcon");

			content.appendChild(icon);

			buttondiv.appendChild(stopButton);
			buttondiv.appendChild(snoozeButton);

		}
		else {
			var stopButton = document.getElementById('stopButton');
			var snoozeButton = document.getElementById('snoozeButton');

			stopButton.innerHTML = "-- Stop Alarms (" + activeAlarms.length + ") --";
			if (snoozeButton) { snoozeButton.innerHTML = "Snooze Alarms <br> (5 minutes)"; }
			
			var hr = document.createElement('hr');
			content.appendChild(hr);
		}

		var p = document.createElement('p');
		p.innerHTML = activeTimers[ID].text;
		p.setAttribute("id","alarmText"+ID);
		content.appendChild(p);

		div.style.opacity = 1;
	}

	function alarmStop() {
		for(let i=0; i < activeAlarms.length; i++) {
			activeAlarms[i].pause();
		}
		activeAlarms = [];
		alarmHide();
	} 

//alarm window manip
function alarmShow(){
	var bg = document.getElementById("alarmBG");

	bg.style.background = "rgba(255,0,0,0.5)";
	bg.style.visibility = "visible";
}
function alarmHide(){
	var bg = 		document.getElementById("alarmBG");
	var div = 			document.getElementById('alarmWindow');
	var buttondiv = 	document.getElementById('alarmButtons');
	var content = 		document.getElementById('alarmContent');
	var stopButton = 	document.getElementById("stopButton");

	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	while(buttondiv.firstChild) {
		buttondiv.removeChild(buttondiv.firstChild);
	}

	div.style.opacity = 0;
	bg.style.background = "rgba(0,0,0,0)";

	setTimeout(function(){bg.style.visibility = "hidden";}, 250);
}

function alarmSnooze(){
	appendText("snoozeButton pressed, expecting alarmSnooze()","status");
	alarmStop();
	eggTimer(0,5,0,"medium countdown","snooze alarm",2);
}

/** BARS **/
function newBar(ID) {
	var parent = document.getElementById('bars');
	var div = document.createElement('div');
	var bar = document.createElement('div');

	var label = document.createElement('p');
	var countdown = document.createElement('p');
	var msText = document.createElement('span');
	var timeText = document.createElement('span');

	div.setAttribute('class',"bar" + " " + activeTimers[ID].style);
	div.setAttribute('id',"bar" + ID);
	bar.setAttribute('class',"progressbar");
	bar.setAttribute('id',"progress" + ID);

	label.setAttribute('id',"barlabel" + ID);
	label.setAttribute('class',"barlabel");
	label.innerHTML = activeTimers[ID].text;

	countdown.setAttribute('class',"barcountdown");

	timeText.setAttribute('class',"barcountdown")
	timeText.setAttribute('id',"barcountdown"+ ID);
	msText.setAttribute('class',"barcountdownms");
	msText.setAttribute('id',"barcountdownms" + ID);

	countdown.appendChild(timeText);
	countdown.appendChild(msText);

	div.appendChild(label);
	div.appendChild(countdown);
	div.appendChild(bar);

	parent.appendChild(div);
}
function hideBar(ID) {
	var parent = document.getElementById('bars');
	var div = document.getElementById('bar'+ID);
	var bar = document.getElementById('progress' + ID)
	var label = document.getElementById('barlabel' + ID);
	var countdown = document.getElementById('barcountdown' + ID);
	var countdownms = document.getElementById('barcountdownms' + ID);



	label.style.color = "rgba(0,0,0,0)";
	countdown.style.color = "rgba(0,0,0,0)";
	countdownms.style.color = "rgba(0,0,0,0)";
	bar.style.height = "0px";
	div.style.height = "0px";
	div.style.marginBottom = "0px";


	setTimeout(function(){parent.removeChild(div);},10000); 
}
function renderBars() {
	now = new Date().valueOf();
	num = activeTimers.length;

	for (i = 0; i < num; i++){
		current = activeTimers[i];
		if(current.active){
			bar = document.getElementById("progress" + activeTimers[i].ID);

			start = current.start.valueOf();
			end = current.finish.valueOf();
			elapsed = now-start;
			total = end-start;
			remainder = total-elapsed;

			elapsedFraction = (elapsed/total*100);

			if (elapsedFraction > 100) 	{ elapsedFraction = 100; }

			if (current.inverted) 	{ widthPercent = 100-elapsedFraction; }
			else 							{ widthPercent = elapsedFraction; }

			if (current.countdown) {
				countdown = document.getElementById("barcountdown" + current.ID);
				ms = 			document.getElementById("barcountdownms" + current.ID);
				countdown.innerHTML 				= renderTime(remainder);
				ms.innerHTML = (msVisible) ? renderMs(remainder) : "";
			}

			widthPercent = widthPercent + "%";

			bar.style.width = widthPercent;
			if (remainder < 2000) bar.style.background = "var(--bar-completing)";

		}
	}
}


function button1() {
	appendText("button pressed","alert");
	eggTimer(0,21,4,"big countdown","bigtest",0);
	eggTimer(5,0,0,"countdown","medium test",1);
	eggTimer(15,0,0,"small","smalltest + looped sound",2);
}

function button2() {
	appendText("button2 pressed");
	eggTimer(1,0,0,"big","loop alarmspam",2)
}

function menuShow(i){
	var bg = document.getElementById("menuBG");
	var focus = document.getElementById(i);

	windowState = i;

	bg.style.visibility = "visible";
	bg.style.background = "var(--wrapperbg-color)"
	focus.style.visibility = "visible";
	focus.style.display = "block";
}

function menuHide(){
	if (windowState){
		var bg = document.getElementById("menuBG");
		var focus = document.getElementById(windowState);

		windowState = false;

		bg.style.background = "rgba(0,0,0,0)";
		focus.style.visibility = "hidden";
		focus.style.display = "none";
		setTimeout(function(){bg.style.visibility = "hidden";}, 250)
	}
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
		msVisible = true;

		text.style.color = "rgba(255,255,255,1)";

		text.style.visibility = "visible";

		div.style.width = "420px";

	}
	else { 
		msVisible = false;

		text.style.color = "rgba(255,255,255,0)";
		setTimeout(function(){
			text.style.visibility = "hidden";
		}, delay);

		div.style.width = "200px";
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
//Warning dialog if protected timer
window.onbeforeunload = function() {
	if (checkProtect()) {
		return "Timers running, close?";
	}
}

function checkProtect() {
	for (var i = 0; i < activeTimers.length; i++) {
		if (activeTimers[i].protected && activeTimers[i].active) {
			return true;
		}
	}
	return false;
}

//Number Things for clocks etc.
function renderTime(i) {
	var d = new Date(i);

	H = d.getHours() - 1;
	M = d.getMinutes();
	S = d.getSeconds();

	h = (H>0) ? addZero(H) + ":" : "";
	m = (M>0) ? addZero(M) + ":" : "";
	s = addZero(S);

	return h+m+s
}
function renderMs(i) {
	var d = new Date(i);
	return "." + addZeroMs(d.getMilliseconds())
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

