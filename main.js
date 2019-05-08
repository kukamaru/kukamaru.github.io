// loops Main function at 11ms rate, initialised on body load
var myvar

//defaults
var msVisible;
var timeStamps;
var optionButtonWidth = "76px";

//variables
var timersRunning = 0;
var canSnooze = true;
var activeTimers = [];
var activeAlarms = [];
var windowState = false;
var optionState = false;
var clockExists;


var KnownElement = false;
var favesArray = []
var dummyFaves = [
{
	text: "steamed eggs",
	soundID: 2,
	duration: timeToMs(30,8),
	style: "big countdown",
	stoppable: true
},
{
	text: "10 minutes",
	soundID: 1,
	duration: timeToMs(0,10),
	style: "countdown big protected",
	pausable: true
},
];


// DO NOT USE before alarms are fixed, pausing is fixed.
// removes dead atos from self.
activeTimers.refresh = function() {
	var cleanArray = [];

	for (var i = 0;i < activeTimers.length; i++){
		if (activeTimers[i].active) cleanArray.push(activeTimers[i]);
	}

	cleanArray.refresh = activeTimers.refresh; //reinstate self
	activeTimers = cleanArray;
}

//gets ato from array
function getActiveTimer(id) {
	for (var i = 0;i < activeTimers.length; i++){
		if (activeTimers[i].id == id) return activeTimers[i];
	}
	console.log("timer not found");
}

/* Init */
function init() {

	const head = document.getElementsByTagName('head')[0];

	function load(src) {
		var newScript = document.createElement('script');
		newScript.src = src;
		newScript.type = 'text/javascript';

		head.appendChild(newScript);
	}

	function style(href) {
		var newStyle = document.createElement('link');
		newStyle.href = href;
		newStyle.rel = 'stylesheet';
		if (arguments.length > 0) {
			newStyle.id = arguments[1];
		}
		head.appendChild(newStyle);
	}	

	init.style = function(i) { style(i); }

	// SCRIPTS TO LOAD
	load("debugtext.js");
	load("audio/sounds.js");
	load("img/backgrounds.js");
	load("img/themes.js");
	load("notes.js");

	// Stylesheets to load
	style("styles/notes.css","stylesheetForNotes");
	style("style.css");
	style("styles/bars.css");
	style("styles/radio.css")
	style("styles/checkbox.css")
	style("styles/buttons.css")
	style("styles/menus.css")


	init.bodyOnLoad = function() {
		const body = document.getElementsByTagName("body")[0];

		//start main loop if clock exists
		clockExists = (document.getElementById("timediv") != undefined);
		if (clockExists) { 
			 myVar = setInterval(mainLoop, 11);
		};

		const isLocal = (window.location.href.includes("file:///C:/Users/utamaru/workspace/"));

		function initLocal() {
			if (localStorage.getItem('trigger','trigger')){
				appendText("trigger detected.","alert");
				localStorage.clear();
				return;
			}

			
			if (typeof(Storage) !== "undefined") {
				appendText("local storage exists");
			} 
			else {
				appendText("no storage");
			}
			appendText("KnownElement " + KnownElement);

			style("local.css");
			setTheme(3);

			var t = document.createTextNode(" (local version)");
			var span = document.createElement("span");
			span.style.color = "var(--alert-color)";
			span.appendChild(t);

			header.appendChild(span);
		}


		if (!document.getElementById("header")){
			header = document.createElement("h1");
			text = document.createTextNode("404 header not found");
			header.appendChild(text);
			header.id="header";
			body.appendChild(header);
		}

		else {
			KnownElement = true;
		}

		setTheme(0);

		if (isLocal) { initLocal(); } 
		if (KnownElement) {

			msVisCheck();
			tsVisCheck();
			fave();

		}

		//check for new timer menu and apply eventlisteners
		if (document.getElementById("newTimerStartButton")) {
			newTimerStartButton.addEventListener("click", function(event){
			event.preventDefault();
			newTimer.submitButton();
			},false);

			newTimerAddFave.addEventListener("click", function(event){
				event.preventDefault();
				newTimer.faveButton();
			},false);
		}


		//check for preloader and hide.
		if (document.getElementById("preloader")) {
			preloader.style.opacity = 0;
			setTimeout(function(){
				body.removeChild(preloader);
			}, 800);
		}

	}
}

var timerRunning = function() {
	for (var i = 0;i<activeTimers.length; i++){
		if (activeTimers[i].active) return true;
	}
	return false;
}

/* Main function */

function mainLoop() {
	if (debug1) { return; } //DEBUG1 stops rendering

	var d = new Date();

	if (timerRunning()){
		timediv.style.background = "var(--active-bar)";
		renderBars();
	}
	else {
		timediv.style.background = "var(--stopped-bar)";
	}

	hours = addZero(d.getHours());
	minutes = addZero(d.getMinutes());
	seconds = addZero(d.getSeconds());
	ms = addZeroMs(d.getMilliseconds());

	text1.innerHTML = "" + hours;
	text2.innerHTML = ":" + minutes;
	text3.innerHTML = ":" + seconds;

	if(msVisible == true){
		text4.innerHTML = "." + ms;
	}

}

//Themes
function setTheme(ID) {
	function setBg(theme){
		if (theme.bg == undefined) return;

		var body = document.getElementsByTagName("body")[0];
		body.style.background = backgrounds.url(theme.bg);
		if (document.getElementById("debugDiv") != undefined){
			debugDiv.style.background = backgrounds.url(theme.debug);
		}
	}

	function setCSSVars(theme){
		if (!theme.css) return;

		let root = document.documentElement;
		let x = theme.css.length;
		for (let i = 0; i < x; i++) {
			root.style.setProperty(theme.css[i].field,theme.css[i].val);
		}
	}

	appendText("theme name:  " + themes[ID].name);

	setBg(themes[ID]);
	setCSSVars(themes[ID]);
}

//New Timer Menu
function newTimer(){
	menuShow("newTimerMenu");
	var form = newTimerForm;
	var div = newTimerMenu;
	var faveButtonStatus;

	newTimer.clicked = function(elem) {
		digits = numLength(elem.value);
		if (digits >= 2){ elem.value = ""; }
	}
	newTimer.changed = function(elem) {
		if (!faveButtonStatus) { faveReactivate(); }

		digits = numLength(elem.value);
		appendText("value: " + elem.value + " from field name:" + elem.name + ".... " + digits + "digits","debug");

		if (digits == 2){
			if (elem.name == "h") {	form.m.focus(); }
			else if  (elem.name == "m") { form.s.focus(); }
			else if  (elem.name == "s") { form.submit.focus(); }					
		}
		else if (digits > 2){ elem.value = ""; }
	}


	function getForm(){
		var h = form.h.value;
		var m = form.m.value;
		var s = form.s.value;
		
		var newTimerObject = { 
			duration: timeToMs(s,m,h),
			text: form.text.value,
			soundID: form.sound.value,

			size: form.size.value,	
			protected: form.protected.value,
			countdown: form.countdown.checked,
			inverted: form.inverted.checked,
		};

		return newTimerObject;
	}

	newTimer.submitButton = function(){
		startTimer(getForm());

		form.reset();
		menuHide();
		faveReactivate();
	}

	newTimer.faveButton = function(){ 
		var nto = getForm();
		favesArray.push(nto);
		fave.saveFaves();

		newTimerAddFave.className = "saved";
		newTimerAddFave.innerHTML = nto.text + " SAVED";
		newTimerAddFave.disabled = true;

		faveButtonStatus = false;
	}

	function faveReactivate(){
		newTimerAddFave.className = undefined;
		newTimerAddFave.innerHTML = "add favorite";
		newTimerAddFave.disabled = false;

		faveButtonStatus = true;
	}
}


//Eggtimer creates a barebones timer object.
function eggTimer(eS,eM,eH,soundID,size,text) {
	var xx = {}; // proto NTO
	if (arguments.length > 0) {
		xx.duration = timeToMs(eS,eM,eH);
		if (size) xx.size = size;
		if (text) xx.text = text;
		if (soundID) xx.soundID = soundID;
	}

	xx.eggtimer = true;
	xx.pausable = true;
	xx.stoppable = true;

	startTimer(xx);
}

function stressTest() {
	var xx = {};
	xx.text = "stressTest";
	xx.style = "big noStyle";
	xx.stoppable = true;
	xx.duration = timeToMs(3);
	xx.action = function(){ startTimer(xx) };
	startTimer(xx);
}

//counter for the makeAto
var newTimerID = (function() {
	var counter = -1;
	return function(){ counter++; return counter }
})()

//creates and activates a ato from nto.
function startTimer(nto){

	// active timer object from nto
	function makeAto(nto){
		var ato = {};
		Object.defineProperties(ato,{
			'id': {
				value:newTimerID(),
				writable:false
			},
			'text': {
				value:"atoTextHere",
				writable:true
			},
			'countdown': {
				value: true,
				writable: true
			},
			'soundID' :{
				value:2,
				writable: true,
			},
			'pausable': {
				value:false,
				writable: true
			},
			'style': { // deprecate this
				value:'noStyle',
				writable: true
			},
			'duration': {
				value:261000,
				writable: true,
			},
			'action': {
				value:function(){appendText("alarm finished -- action","alert");},
				writable: true
			},

			'stoppable': {
				value:false,
				writable:true
			},
			'className': {
				value:function(){
					var str = "bar";
					if (this.size) str = str + " " + this.size;
					if (this.inverted) str = str + " inverted";
					if (this.countdown) str = str + " countdown";
					if (this.paused) str = str + " paused";
					return str;
				}
			}
		});
		if (nto){
			Object.assign(ato,nto);
		} else {
			console.log("no nto, falling back on defaults");
			console.log(ato);
		}
		return ato;
	}
	
	var d = new Date(); 
	var ato = makeAto(nto);

	var f = new Date(d.valueOf() + ato.duration);

	ato.start = 		d;
	ato.finish = 		f;

	ato.alarm = setAlarm(ato);
	ato.active = true;
	
	activeTimers.push(ato); //important.
	newBar(ato);

}

function setAlarm(ato) {
	return setTimeout(function(){alarm(ato);},ato.duration);
}	

function alarm(ato) {

	var isLooping = sounds[ato.soundID].looping;

	appendText(ato.text,"alert");		
	var audio = new Audio(sounds[ato.soundID].src);
	if (isLooping){
		audio.setAttribute("loop",true);
		audio.play();
		activeAlarms.push(audio);

		alarmWindow(ato);
	}
	else { audio.play(); }
	ato.action();

	hideBar(ato);
	ato.active = false;

}

function alarmWindow(ato) {
	alarmShow();
	firstAlarm = (activeAlarms.length == 1);

	//create buttons if first
	if (firstAlarm){ 						

		var newStopButton = document.createElement('button');
		newStopButton.setAttribute("onclick","alarmStop()");
		newStopButton.setAttribute("id","stopButton");
		newStopButton.setAttribute("class","stopButton");
		newStopButton.innerHTML = "-- Stop Alarm --";

		if (canSnooze){
			var newSnoozeButton = document.createElement('button');
			newSnoozeButton.setAttribute("onclick",'alarmSnooze()');
			newSnoozeButton.setAttribute("id","snoozeButton");
			newSnoozeButton.setAttribute("class","snoozeButton");
			newSnoozeButton.innerHTML = "Snooze Alarm <br> (5 minutes)";
		}

		icon = document.createElement('div');
		icon.setAttribute("class","alarmIcon");

		alarmContent.appendChild(icon);

		alarmButtons.appendChild(newStopButton);
		alarmButtons.appendChild(newSnoozeButton);
	}
	//modify text on buttons if there are more alarms
	//and add a <hr>
	else {
		stopButton.innerHTML = "-- Stop Alarms (" + activeAlarms.length + ") --";
		if (document.getElementById('snoozeButton')) { 
			snoozeButton.innerHTML = "Snooze Alarms <br> (5 minutes)"; 
		}

		var hr = document.createElement('hr');
		alarmContent.appendChild(hr);
	}

	//text to window
	var p = document.createElement('p');
	p.innerHTML = ato.text;
	p.setAttribute("id","alarmText"+ato.id);
	alarmContent.appendChild(p);

	alarmWindowDiv.style.opacity = 1;
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
	//delete content and buttons
	while(alarmContent.firstChild) {
		alarmContent.removeChild(alarmContent.firstChild);
	}
	while(alarmButtons.firstChild) {
		alarmButtons.removeChild(alarmButtons.firstChild);
	}


	//hide window
	alarmWindowDiv.style.opacity = 0;
	alarmBG.style.background = "rgba(0,0,0,0)";
	setTimeout(function(){alarmBG.style.visibility = "hidden";}, 250);
}

function alarmSnooze(){
	appendText("snoozeButton pressed, expecting alarmSnooze()","status");
	alarmStop();
	eggTimer(0,5,0,"medium countdown","snooze alarm",2);
}

/** BARS **/
/* CLICK AND PAUSE */

function clickedBar(id) {
	appendText("you clicked on bar " + id,"debug");
}

function stopTimer(input) {
	var ato;
	
	if (typeof input === 'number') {
		ato = getActiveTimer(input);
	}
	else if (typeof input === 'object') {
		ato = input;
	}

	ato.active = false;
	clearTimeout(ato.alarm);
	hideBar(ato);

	appendText("stopped timer " + ato.id)

}


function pauseResume(input) {

	var ato;

	if (typeof input === 'number') {
		ato = getActiveTimer(input);
	}
	else if (typeof input === 'object') {
		ato = input;
	}

	var now = new Date().valueOf();
	var div = document.getElementById("bar" + ato.id);

	// pausing
	if (ato.pausable && !ato.paused) {
		appendText("pausing " + ato.id);

		var start 		= ato.start.valueOf();
		var end 			= ato.finish.valueOf();

		var elapsed 	= now-start;
		var total 		= end-start;
		var remainder	= total-elapsed;

		ato.paused = true;
		ato.pausedAt = now;
		ato.pRemainder = remainder;
		ato.pElapsed = elapsed;

		div.className = ato.className();

		clearTimeout(ato.alarm);
	}
	// resuming
	else if (ato.paused) {
		appendText("resuming " + ato.id);

		var newFinish = now + ato.pRemainder;
		var newStart = now - ato.pElapsed; 

		ato.finish = new Date(newFinish);
		ato.start = new Date(newStart);
		ato.duration = ato.pRemainder;

		ato.pausedAt = undefined;
		ato.paused = false;

		div.className = ato.className();

		ato.alarm = setAlarm(ato);
	}
}

function newBar(ato) {
	function bar(ato) { 
		var div = document.createElement('div');
		var bar = document.createElement('div');

		var label = document.createElement('p');
		var countdown = document.createElement('p');
		var msText = document.createElement('span');
		var timeText = document.createElement('span');


		div.setAttribute('class',ato.className());
		div.setAttribute('id',"bar" + ato.id);
		div.setAttribute('onclick',"clickedBar("+ato.id+")");
		bar.setAttribute('class',"progress" + ato.className());
		bar.setAttribute('id',"progress" + ato.id);

		label.setAttribute('id',"barlabel" + ato.id);
		label.setAttribute('class',"barlabel");
		label.innerHTML = ato.text;

		countdown.setAttribute('class',"barcountdown");

		timeText.setAttribute('class',"barcountdown")
		timeText.setAttribute('id',"barcountdown"+ ato.id);
		msText.setAttribute('class',"barcountdownms");
		msText.setAttribute('id',"barcountdownms" + ato.id);

		countdown.appendChild(timeText);
		countdown.appendChild(msText);

		div.appendChild(label);
		div.appendChild(countdown);
		div.appendChild(bar);

		return div;
	}
	function barButtons(ato){
		var div = document.createElement("div");
		div.className = "barButtons";

		if (ato.pausable){
			var pause = document.createElement("button");
			pause.id = "barPauseButton" + ato.id;
			pause.innerHTML = "Pause";
			pause.className = "barButton barPauseButton";
			pause.setAttribute("onclick","pauseResume(" + ato.id + ")");
			div.appendChild(pause);
		}
		if (ato.stoppable){
			var stop = document.createElement("button");
			stop.id = "barStopButton" + ato.id;
			stop.innerHTML = "Stop";
			stop.className = "barButton barStopButton";
			stop.setAttribute("onclick","stopTimer(" + ato.id + ")");
			div.appendChild(stop);
		}

		return div;
	}

	var newBar = bar(ato);
	if (ato.pausable || ato.stoppable){
		newBar.appendChild(barButtons(ato));
	}
	bars.appendChild(newBar);
}
function hideBar(ato) {
	var parent = document.getElementById('bars');
	var div = document.getElementById('bar'+ato.id);
	var bar = document.getElementById('progress' + ato.id)
	var label = document.getElementById('barlabel' + ato.id);
	var countdown = document.getElementById('barcountdown' + ato.id);
	var countdownms = document.getElementById('barcountdownms' + ato.id);



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

	var now = new Date().valueOf();
	var num = activeTimers.length;

	for (i = 0; i < num; i++){
		var current = activeTimers[i]; // get current ato from all in array.
		if(current.active && !current.paused){
			var bar = document.getElementById("progress" + current.id);

			var start = current.start.valueOf();
			var end = current.finish.valueOf();
			var elapsed = now-start;
			var total = end-start;
			var remainder = total-elapsed;

			var elapsedFraction = (elapsed/total*100);

			if (elapsedFraction > 100) 	{ elapsedFraction = 100; }

			if (current.inverted) 	{ widthPercent = 100-elapsedFraction; }
			else 							{ widthPercent = elapsedFraction; }

			if (current.countdown) {
				var countdown = document.getElementById("barcountdown" + current.id);
				var ms = 			document.getElementById("barcountdownms" + current.id);
				countdown.innerHTML 				= renderTime(remainder);
				ms.innerHTML = (msVisible) ? renderMs(remainder) : "";
			}

			var widthPercent = widthPercent + "%";

			bar.style.width = widthPercent;
			if (remainder < 2000) bar.style.background = "var(--bar-completing)";
		}
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
		newTimerMinutes.focus();
	}
	if (windowState == "menu") {
		fave.refresh();
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
	if (optionState){ fave.toggleOptions(); }
}

//executed on body loaded.
function fave(){
	function collapseSpacer(i) {
		var collapse = i;

		if (collapse) {
			prefav.style.padding = "12px 0 2px";
			postfav.style.padding = "0 0 12px";
			nofav.style.opacity = 1;
		}
		else {
			prefav.style.padding = "10px 0";
			postfav.style.padding = "10px 0";
			nofav.style.opacity = 0;
		}
	}

	// empties list in menu
	function clearFaves(){
		while (favorites.firstChild){
			favorites.removeChild(favorites.firstChild);
		}
	}

	// fills list in menu
	function populateFaves(){
		function newFaveButton(fave,id){

			li = document.createElement("li");
			
			function make(text,c,id){
				var btn = document.createElement("button");
				var txt = document.createTextNode(text);
				btn.setAttribute("class",c);
				btn.setAttribute("id",c+id);
				btn.setAttribute("onclick","javascript:fave."+c+"("+id+")")
				btn.appendChild(txt);
				return btn;
			}

			var faveButton = make(fave.text,"launch",id);

			var br = document.createElement("br");
			var duration = document.createTextNode(msToString(fave.duration));

			faveButton.appendChild(br);
			faveButton.appendChild(duration);


			li.appendChild(faveButton);
			li.appendChild(make("EDIT"				,"edit"		,id));
			li.appendChild(make("DEL"				,"delete"	,id));

			li.setAttribute("id","faveli"+id)
			return li;
		}

		collapseSpacer((favesArray.length == 0));

		for (var i = 0; i < favesArray.length;i++){
			favorites.appendChild(newFaveButton(favesArray[i],i));
		}
	}

	// menu functions
	fave.delete = function(id) {
		function notDeleted(){
			var n = 0;
			for (var i = 0; i < favesArray.length; i++){
				if (!favesArray[i].deleted) n++
			}
			return n;
		}
		function deleteIt() {
			favorites.removeChild(li);
		}

		var li = document.getElementById("faveli" + id);
		var x = li.children;
		for (var i = 0 ; i < x.length ; i++ ) {
			x[i].style.opacity = 0;
			x[i].style.height = "0px";
			x[i].style.borderWidth = "0px";
		}
		li.style.padding = 0;

		favesArray[id].deleted = true;

		fave.saveFaves();
		if(notDeleted() == 0){ collapseSpacer(true); fave.toggleOptions(); }
		setTimeout(function(){ deleteIt(); },505); // delete after animation time + 5ms / 0.505s
	}

	fave.toggleOptions = function() {
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
			document.getElementsByClassName("launch")[x].style.borderRightColor = (optionState) ? "black" : "transparent";
		}

		optionState = !optionState;	
	}
	fave.launch = function(id) {
		newTimerObject = favesArray[id];
		startTimer(newTimerObject);
	}

	// cleans deleted faves from array
	fave.refresh = function(){
		clearFaves();

		var cleanArray = [];
		for (var i = 0;i < favesArray.length;i++){
			if (!favesArray[i].deleted){
				cleanArray.push(favesArray[i]);
			}
		}

		favesArray = cleanArray;

		populateFaves();
	}


	//retrieve faves from local storages, or dummy faves if no local file.
	function storedFaves(){
		var stringified = localStorage.getItem('faves');
		return (stringified) ? JSON.parse(stringified) : dummyFaves;
	}

	//save faves to local storage
	fave.saveFaves = function(){
		var stringified = JSON.stringify(favesArray);
		localStorage.setItem('faves',stringified)

		appendText("saving faves","debug2");
	}

	favesArray = storedFaves();
	populateFaves();
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



// Testing Junk

function testButton1() {
	appendText("testButton1 pressed","alert");
	eggTimer(0,21,4,0,"big","bigtest");
	eggTimer(5,0,0,1,"medium","medium test");
	eggTimer(15,0,0,2,"small","smalltest + looped sound");
}

function testButton2() {
	appendText("testButton2 pressed");
	eggTimer(1,0,0,2,"big","loop alarmspam")
}

// Debug Trigger and Menu

var debug = false;
var debug1 = false; //	time render stop
var debug2 = false; //	emulate online.

var debugMenu = function(){

	var hidden = !(debugDiv.style.height == "200px");
	if (!debug) { 
		appendText("opening debug menu","alert"); 
		appendText("debug = " + (debug = true),"status");
	}
	debugDiv.style.height = (hidden) ? "200px" : "0px";


	debugMenu.check = function(){
		debug1 = debugCheck1.checked;
		debug2 = debugCheck2.checked;

			appendText("debug1 = " + i + " = " + debug1);

			appendText("debug2 = " + i + " = " + debug2);
		if (debug2) {
			localStorage.setItem('trigger','trigger');
		}

	}
}

function clearEnable() {
	var check = danger.checked;
	deleteDataButton.disabled = (check);
	appendText("button enabled = " + check, "debug");
}

function clearLocalStorage() {
	localStorage.clear();
	appendText("local storage cleared", "alert");
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

function timeToMs(s = 0,m = 0,h = 0) {
	return ( s*1000 ) + (m*60*1000) + (h*60*60*1000);
}
function msToString(ms) {
	var h = Math.floor(ms/60/60/1000);
	ms = ms - h*60*60*1000
	var m = Math.floor(ms/60/1000);
	ms = ms - m*60*1000
	var s = Math.floor(ms/1000);

	var string = "";
	var substr = "";

	if ( h > 0 ) {
		substr = (h==1) ? " hour" : " hours";
		string = h+substr;
	}
	if ( m > 0 ) { 
		if (string!="") { string = string + " "; }
		substr = (m==1) ? " minute" : " minutes";
		string = string + m + substr;
	}
	if ( s > 0 ) { 
		if (string!="") { string = string + " "; }
		substr = (s==1) ? " second" : " seconds";
		string = string + s + substr;
	}
	return string;
}

function numLength(x) { return x.toString().length; }
function isEven(x) { return (x%2)==0; }
function evenOdd(x) { if (isEven(x)){return "even";} else {return "odd";} }
