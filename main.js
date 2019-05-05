// loops Main function at 11ms rate
var myVar = setInterval(mainLoop, 11);

//faves (wip)
var myFaves = 3;

//defaults
var msVisible;
var timeStamps;
var optionButtonWidth = "76px";

//variables
var timerRunning = false;
var timersRunning = 0;
var canSnooze = true;
var activeTimers = [];
var activeAlarms = [];
var timerOrigin;
var windowState = false;
var optionState = false;



/* Init */
function bootUp() {
	const head = document.getElementsByTagName('head')[0];
	function load(src) {
		var newScript = document.createElement('script');
		newScript.src = src;
		newScript.type = 'text/javascript';

		head.appendChild(newScript)
	}

	function style(href) {
		var newStyle = document.createElement('link');
		newStyle.href = href;
		newStyle.rel = 'stylesheet';
		if (arguments.length > 0) {
			newStyle.id = arguments[1];
		}
		head.appendChild(newStyle)
	}

	load("debugtext.js");					// SCRIPTS TO LOAD
	load("audio/sounds.js");
	load("img/backgrounds.js");
	load("img/themes.js");
	load("notes.js");
													// Stylesheets to load
	style("notes.css","stylesheetForNotes");
	style("style.css")
}

function bodyLoad() {
	function isLocal() {
		return (window.location.href != "http://www.utamaru.com/");
	}

	function checkCookies() {
		return (navigator.cookieEnabled);
	}
	/* cookie shit
		appendText("cookies enabled? " + checkCookies(),"status");
		if (checkCookies) { 
			appendText(document.cookie); 

			var testText = document.getElementById("testText01");
			testText.value = getCookie("test1");
		} 			
	*/

	if (isLocal()) { 
		appendText("local file, executing initLocal();");
		initLocal(); 
	}

	msVisCheck();
	tsVisCheck();
	loadFaves();

	document.querySelector("#newTimerStartButton").addEventListener("click", function(event){
		event.preventDefault();
		newTimer.submitButton();
	},false);

	document.querySelector("#newTimerAddFave").addEventListener("click", function(event){
		event.preventDefault();
		newTimer.faveButton();
	},false);
}

function initLocal() {
	setTheme(0);

	var header = document.getElementById("header");
	var t = document.createTextNode(" (local version)");
	
	var span = document.createElement("span");
	span.style.color = "var(--alert-color)";
	span.appendChild(t);

	header.appendChild(span);

	document.getElementById("debugButan").style.visibility = "visible";
}


/* Main Function */

function mainLoop() {
	if (debug1) { return; } //DEBUG1 stops rendering

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

//Favorite Timer


function setTheme(themeid) {

	var getUrl = function(i) { 
		o = "url(" + i + ")";
		return o;
	}

	function setBg(i){
		//input is a theme from themes.js

		var debugbg = document.getElementById("debug");
		var bg = document.getElementsByTagName("body")[0];

		appendText(getUrl(backgrounds[i.bg].src),"debug");
		appendText(getUrl(backgrounds[i.debug].src),"debug blue");

		debugbg.style.background = getUrl(backgrounds[i.debug].src);
		bg.style.background = getUrl(backgrounds[i.bg].src);
	}

	setBg(themes[themeid]);
}



//New Timer Menu Function

var newTimer = function() {
	var form = document.getElementById("newTimerForm");
	var div = document.getElementById("newTimerMenu");


	newTimer.clicked = function(obj) {
		digits = numLength(obj.value);
		if (digits >= 2){ obj.value = ""; }
	}

	newTimer.changed = function(obj) {

		digits = numLength(obj.value);
		appendText("value: " + obj.value + " from field name:" + obj.name + ".... " + digits + "digits","debug");

		if (digits == 2){
			if (obj.name == "h") {	form.m.focus(); }
			else if  (obj.name == "m") { form.s.focus(); }
			else if  (obj.name == "s") { form.submit.focus(); }					
		}
		else if (digits > 2){ obj.value = ""; }
	}

	newTimer.submitButton = function() { submit(); }
	newTimer.faveButton = function(){ 
		appendText("faves not working","alert");
	}

	function submit(){
		var h = form.h.value;
		var m = form.m.value;
		var s = form.s.value;
		var size = form.size.value;
		var text = form.text.value;
		var soundID = form.sound.value;
		var protected = form.protected.value;
		var style = size;

		if (form.countdown.checked){ style = "countdown " + style; }
		if (form.inverted.checked){ style = "inverted " + style; }
		if (form.protected.checked){ style = "protected " + style; }

		eggTimer(s,m,h,soundID,style,text);

		form.reset();
		menuHide();
	}
}

function eggTimer(eS,eM,eH,sound,style,text) {
	var cookingTime = function(s = 10, m = 0, h = 0) {

		return ( s*1000 ) + (m*60*1000) + (h*60*60*1000);
	}
	ms = cookingTime(eS,eM,eH);

	appendText(text + " starting (eggtimer), " + ms + " milliseconds","status");
	startTimer(ms,sound,style,text);
}


var timerID = 0;
function startTimer(T,soundID = 0,style = "noStyle",text = "noText") {
	var d = new Date(); 
	var f = new Date(d.valueOf() + T);

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
				snoozeButton.innerHTML = "Snooze Alarm <br> (5 minutes)";
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

	if (debug2) { return; } //DEBUG

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

function loadFaves(){
	var ul = document.getElementById("favorites")

	function newFaveButton(id){
		li = document.createElement("li");

		function make(text,c,id){
			var i = document.createElement("button");
			var t = document.createTextNode(text);
			i.setAttribute("class",c);
			i.setAttribute("id",c+id);
			i.setAttribute("onclick","javascript:" + c + "FaveButton(" + id + ")")
			i.appendChild(t);
			return i;
		}

		li.appendChild(make("NAME OF BUTAN"	,"fave"		,id));
		li.appendChild(make("EDIT"				,"edit"		,id));
		li.appendChild(make("DEL"				,"delete"	,id));

		li.setAttribute("id","faveli"+id)
		return li;
	}

	if (myFaves == 0) {
		collapseSpacer(false);
	}
	for (var i = 0 ; i < myFaves ; i++){
		ul.appendChild(newFaveButton(i));
	}
}

function menuShow(i){
	if (windowState) { 
		var current = document.getElementById(windowState);
		current.style.display = "none";
	}

	var bg = document.getElementById("menuBG");
	var focus = document.getElementById(i);

	bg.style.visibility = "visible";
	bg.style.background = "var(--wrapperbg-color)"
	focus.style.visibility = "visible";
	focus.style.display = "flex";

	windowState = i;
	if (windowState == "newTimerMenu") { 
		//bake into newtimer
		document.getElementById("newTimerMinutes").focus();
		newTimer();
	}
}

function menuHide() {
	if (windowState){
		var bg = document.getElementById("menuBG");
		var focus = document.getElementById(windowState);

		windowState = false;

		bg.style.background = "rgba(0,0,0,0)";
		focus.style.visibility = "hidden";
		focus.style.display = "none";
		setTimeout(function(){bg.style.visibility = "hidden";}, 250)
	}
	if (optionState){ toggleOptions(); }
}

function toggleOptions() {
	var a = document.getElementsByClassName("edit");
	var b = document.getElementsByClassName("delete");

	function applyStyle(i,state) {
		i.style.width = (!state) ? optionButtonWidth : "0%";
		i.style.borderWidth = (!state) ? "1px" : "0px";
		i.style.opacity = (!state) ? 1 : 0;
	}

	for (var x = 0 ; x < a.length ; x++ ){
		applyStyle(a[x],optionState);
		applyStyle(b[x],optionState);
		document.getElementsByClassName("fave")[x].style.borderRightColor = (optionState) ? "black" : "transparent";
	}

	optionState = !optionState;	
}

function deleteFaveButton(id) {
	var par = document.getElementById("favorites");
	var li = document.getElementById("faveli" + id);
	var x = li.children;

	function deleteIt() {
		par.removeChild(li);
	}

	for (var i = 0 ; i < x.length ; i++ ) {
		x[i].style.opacity = 0;
		x[i].style.height = "0px";
		x[i].style.borderWidth = "0px";
	}

	li.style.padding = 0;


	myFaves--;
	if(myFaves == 0){ collapseSpacer(true); toggleOptions(); }
	setTimeout(function(){ deleteIt(); },505); // delete after animation time + 5ms / 0.505s
}

function collapseSpacer(i) {
	var collapse = i;

	upper = document.getElementById("prefav");
	lower = document.getElementById("postfav");
	label = document.getElementById("nofav");

	if (collapse) {
		upper.style.padding = "2px 0 2px";
		lower.style.padding = "0 0 12px";
		label.style.opacity = 1;
		faveSpacerCollapsed = true;
	}
	else {
		upper.style.padding = "10px 0";
		lower.style.padding = "10px 0";
		label.style.opacity = 0;
		faveSpacerCollapsed = false;		
	}
}

/* Timestamp Checkbox */
function tsVisCheck() {
	var checkBox = document.getElementById("tsCheck");
	timeStamps = checkBox.checked;

	var stamps = document.getElementsByClassName("timestamp");

	for (i = 0; i < stamps.length; i++){
		stamps[i].style.opacity = (timeStamps) ? 1 : 0;
		stamps[i].style.width = (timeStamps) ? "auto" : "0px";
	}
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

		div.style.width = "440px";

	}
	else { 
		msVisible = false;

		text.style.color = "rgba(255,255,255,0)";
		setTimeout(function(){
			text.style.visibility = "hidden";
		}, delay);

		div.style.width = "420px";
	}
}


//Warning dialog if protected timer
window.onbeforeunload = function() {

	function checkProtect() {
		for (var i = 0; i < activeTimers.length; i++) {
			if (activeTimers[i].protected && activeTimers[i].active) { return true; }
		}
		return false;
	}

	if (checkProtect()) { return "Timers running, close?"; }	
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

function numLength(x) { return x.toString().length; }
function isEven(x) { return (x%2)==0; }
function evenOdd(x) { if (isEven(x)){return "even";} else {return "odd";} }

/* Cookies */

/* use LocalStorage instead */
function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();

	appendText("cookie saved:" + cname + "=" + cvalue);
	appendText(expires,"status")

	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}


// Testing Junk

function testButton1() {
	appendText("testButton1 pressed","alert");
	eggTimer(0,21,4,"big countdown","bigtest",0);
	eggTimer(5,0,0,"countdown","medium test",1);
	eggTimer(15,0,0,"small","smalltest + looped sound",2);
}

function testButton2() {
	appendText("testButton2 pressed");
	eggTimer(1,0,0,"big","loop alarmspam",2)
}

// Debug Trigger and Menu

var debug = false;
var debug1 = false; //	time render stop
var debug2 = false; //	bar render stop

var debugMenu = function(){
	var div = document.getElementById("debug");
	var hidden = (div.style.height == "0px");

	debugMenu.check = function(i){
		var checkbox = document.getElementById("debug" + i).checked;	
		if (i == 1) { 
			debug1 = (!debug1); 
			appendText("debug1 = " + i + " = " + debug1);
		}

		if (i == 2) { 
			debug2 = (!debug2);
			appendText("debug2 = " + i + " = " + debug2);
		}
	}

	if (!debug) { 
		appendText("opening debug menu","alert"); 
		appendText("debug = " + (debug = true),"status");
	}

	div.style.height = (hidden) ? "200px" : "0px";
}
