// loops Main function at 11ms rate, initialised on body load
var coreLoop;

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
var storageTrigger = false;


var KnownElement = false;
var favesArray = []
var dummyFaves = [
{
	text: "steamed eggs",
	soundID: 2,
	duration: timeToMs(30,8),
	stoppable: true
}
,
{
	text: "thing forthe test",
	soundID: 1,
	duration: timeToMs(0,10),
	pausable: true,
	location: "box",
	size: "big"
},{
	text: "thing forthe test",
	soundID: 1,
	duration: timeToMs(0,10),
	pausable: true,
	location: "box",
	size: "small"
},{
	text: "thing forthe test",
	soundID: 1,
	duration: timeToMs(0,10),
	pausable: true,
	location: "box",
	size: "medium"
}


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

function saveActiveTimers() {
	activeTimers.refresh();
	console.log(activeTimers);

	var string = JSON.stringify(activeTimers);
	console.log(string);
	localStorage.setItem('activeTimers', string)
}

function recallTimers() {
	var thing = JSON.parse(localStorage.getItem('activeTimers'));
	if (thing){
		for (var i = 0; i < thing.length; i++)
		{
			reactivate(thing[i]);
		}
	}
}

function reactivate(ato){
	ato.id = newTimerID();
	ato.className = atoClassName();

	ato.action = function() { appendText("action gone"); };
	ato.action2 = function() { appendText("action gone"); };

	console.log(ato);

	if (!ato.paused) {
		newBar(ato);
		pause(ato);
		resume(ato);
	} else {
		ato.needsRefresh = true;
		newBar(ato);
	}

	activeTimers.push(ato);
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
	load("scripts/debugtext.js");
	load("scripts/sounds.js");
	load("scripts/backgrounds.js");
	load("scripts/themes.js");
	load("scripts/notes.js");
	load("lib/howler.js")

	// Stylesheets to load
	style("styles/notes.css","stylesheetForNotes");
	style("style.css");
	style("styles/bars.css");
	style("styles/radio.css");
	style("styles/checkbox.css");
	style("styles/buttons.css");
	style("styles/menus.css");
	style("styles/autogrid.css");



	init.bodyOnLoad = function() {
		setTimeout(delayed,50);

		const body = document.getElementsByTagName("body")[0];
		prepThemes();
		//start main loop if clock exists
		clockExists = (document.getElementById("timediv") != undefined);

		var isLocal = (window.location.href.includes("file:///C:/Users/utamaru/workspace/")
			||
			window.location.href.includes("http://127.0.0.1:8080/"));

		function initLocal() {

			if (typeof(Storage) !== "undefined") {
				appendText("local storage exists");
			} 
			else {
				appendText("no storage");
			}
			appendText("KnownElement " + KnownElement);

			style("styles/local.css");

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


		if (localStorage.getItem('trigger','trigger')){
			appendText("all data deleted","alert");
			isLocal = false;
			localStorage.clear();
		}

		if (isLocal) { initLocal(); } 
		if (KnownElement) {
			setTimeout(msVisCheck);
			setTimeout(tsVisCheck);
			fave();
			grid();
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

		if (isLocal) { 
			setTimeout(setTheme(3), 5000); 
		}
		else { setTimeout(setTheme(0), 5000); }



	}


	function delayed() {
		recallTimers()
		//notes();
		//notes.show();
		if (clockExists) { 
			coreLoop = setInterval(mainLoop, 11);
		};
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
function setTheme(input) {
	let root = document.documentElement;


	function setCSSVars(cssarray){
		if (!cssarray) return;

		let x = cssarray.length;
		
		//old format
		if (!Array.isArray(cssarray[0])){
			for (let i = 0; i < x; i++) {
				root.style.setProperty(cssarray[i].field,cssarray[i].val);
			}
		}

		//new format
		else if (Array.isArray(cssarray[0])) {
			for (let i = 0; i < x; i++) {
				root.style.setProperty(cssarray[i][0],cssarray[i][1]);
			}
		}
	}

	function setBg(theme){
		if (theme.bg == undefined) return;
		root.style.setProperty("--background-image",backgrounds.url(theme.bg));
		if (backgrounds[theme.bg].css){
			setCSSVars(backgrounds[theme.bg].css)
		}


		if (document.getElementById("debugDiv") != undefined){
			root.style.setProperty("--debug-image",backgrounds.url(theme.debug));
		}
	}


	//check for theme index or theme itself
	if (input.isTheme) {
		setBg(input);		
		setCSSVars(input.css.css());
		appendText("theme name:  " + input.name);

	}	
	else if (typeof input === "number"){
		setBg(themes[input]);
		setCSSVars(themes[input].css.css());
		appendText("theme name:  " + themes[input].name);

	}

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
		if (h+m+s == 0){
			return false;
		}
		else {
			var newTimerObject = { 
				duration: timeToMs(s,m,h),
				text: form.text.value,
				soundID: parseInt(form.sound.value),

				size: form.size.value,	
				protected: form.protected.value,
				countdown: form.countdown.checked,
				inverted: form.inverted.checked,
			};
			return newTimerObject;
		}

	}

	newTimer.submitButton = function(){
		if (getForm()){

			startTimer(getForm());

			form.reset();
			menuHide();
			faveReactivate();
		}
	}

	newTimer.faveButton = function(){ 
		if (getForm()){
			var nto = getForm();
			favesArray.push(nto);
			fave.saveFaves();

			newTimerAddFave.className = "saved";
			newTimerAddFave.innerHTML = nto.text + " SAVED";
			newTimerAddFave.disabled = true;

			faveButtonStatus = false;
		}
	}

	function faveReactivate(){
		newTimerAddFave.className = undefined;
		newTimerAddFave.innerHTML = "add favorite";
		newTimerAddFave.disabled = false;

		faveButtonStatus = true;
	}
}


function NewTimerObject(eS = 1000,eM,eH,soundID,size,text){

	if (arguments.length > 0) {
		this.duration = timeToMs(eS,eM,eH);
		if (size) this.size = size;
		if (text) this.text = text;
		if (soundID) this.soundID = soundID;
	}

	this.eggtimer = true;
	this.pausable = true;
	this.stoppable = true;
}
function stopWatch(){
	var nto = new NewTimerObject();
	nto.duration = false;
	nto.location = "box";
	nto.countdown = false;
	nto.text = "";
	nto.stoppable = true;
	nto.size = "medium";

	startTimer(nto);
}

//Eggtimer creates a barebones timer object.
function eggTimer(eS,eM,eH,soundID,size,text) {
	var xx = new NewTimerObject(eS,eM,eH,soundID,size,text);

	startTimer(xx);
}

function stressTest() {
	var xx = {};
	xx.text = "stressTest";
	xx.style = "big noStyle";
	xx.stoppable = true;
	xx.duration = timeToMs(3);
	xx.action = function(){ startTimer(xx) };
	xx.action2 = function(){ startTimer(xx) };
	startTimer(xx);
}

//counter for the makeAto
var newTimerID = (function() {
	var counter = -1;
	return function(){ counter++; return counter }
})()

function atoClassName() {
	return function(){
		{	
			var str = "bar";
			if (this.size) str = str + " " + this.size;
			if (this.inverted) str = str + " inverted";
			if (this.countdown) str = str + " countdown";
			if (this.paused) str = str + " paused";
			if (this.location) str = str + " " + this.location;
			return str;
		}
	}
}


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
				writable:true,
				enumerable: true
			},
			'countdown': {
				value: true,
				writable: true,
				enumerable: true
			},
			'soundID' :{
				value:2,
				writable: true,
				enumerable: true
			},
			'size' :{
				value:"normal",
				writable: true,
				enumerable: true
			},
			'pausable': {
				value:false,
				writable: true,
				enumerable: true
			},
			'location': {
				writable: true,
				value: "corner",
				enumerable: true
			},
			'action': {
				value:function(){appendText("alarm finished -- action","alert");},
				writable: true
			},
			'action2': {
				value:function(){appendText("alarm confirmed, func 2");},
				writable: true
			},
			'stoppable': {
				value:false,
				writable:true,
				enumerable: true
			},
			'className': {
				value:atoClassName(),
				enumerable: true
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
	
	var d = new Date().valueOf();
	var ato = makeAto(nto);
	ato.start = d;


	if (ato.duration){
		ato.finish = d + ato.duration;
		ato.alarm = setAlarm(ato);
	} else {
		ato.finish = d + ato.estimate;
	}

	ato.active = true;
	
	activeTimers.push(ato); //important.
	newBar(ato);

}

function setAlarm(ato) {
	return setTimeout(function(){alarm(ato);},ato.duration);
}	

//autoplay issues if refreshed and no interaction
function alarm(ato) {

	var soundID = ato.soundID

	var isLooping = sounds[soundID].looping;

	appendText(ato.text,"alert");		

	if (isLooping){
		var audio = new Howl({
			src: sounds[soundID].src,
			loop: true
		});
		audio.play();

		ato.audio = audio;

		activeAlarms.push(ato);

		alarmWindow(ato);
	}

	else { 
		var audio = new Howl({src: sounds[soundID].src});
		audio.play();
	}

	ato.action();

	hideBar(ato);
	ato.active = false;

}


function grid(){

	while(gridUl.firstChild){
		gridUl.removeChild(gridUl.firstChild);
	}

	function newBox() {
		//takes ato or string arguments.
		var ato
		if (typeof arguments[0] === "object"){
			ato = arguments[0];
		}

		else if (arguments[0] == "recipe") {
			ato = {};
			ato.text = "the bomb bread";
			ato.size = "big";
			ato.id = arguments[1];
			ato.location = "recipe";
		} else {
			ato = {};
			ato.size = "";
		}


		var li = document.createElement("li");
		var h2 = document.createElement("h2");
		var text = document.createTextNode(ato.text);


		h2.appendChild(text)
		li.appendChild(h2);

		var div = document.createElement("div");
		div.id = ato.location + "bar" + ato.id;
		div.className = ato.location + "bar";

		li.className = ato.size;
		li.appendChild(div);

		return li;
	}

	//called from renderbars

	grid.recipe = function() {
		var box = newBox("recipe",myBread.id);
		//box.className = "recipeBox";
		box.id = "recipeBox";

		var ingredients = myBread.getIngredients("ul");
		myBread.hasWindow = true;

		box.appendChild(ingredients);
		gridUl.appendChild(box);
	}


	grid.spawn = function(ato){
		var box = newBox(ato);



		gridUl.appendChild(box);
	}

	grid.populate = function(){
		var boxes = 12;
		while (boxes){
			var box = newBox();

			box.className = "noorder";
			box.id ="boxNumber" + boxes;

			gridUl.appendChild(box);
			boxes--;
		}
	}
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
		activeAlarms[i].audio.pause();
		activeAlarms[i].action2();
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

function pause(ato) {
	var now = new Date().valueOf();

	var div = document.getElementById("bar" + ato.id);


	var start 		= ato.start;
	var end 			= ato.finish;

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
function resume(ato) {
	var now = new Date().valueOf();

	var div = document.getElementById("bar" + ato.id);


	var newFinish = now + ato.pRemainder;
	var newStart = now - ato.pElapsed; 

	ato.finish = new Date(newFinish).valueOf();
	ato.start = new Date(newStart).valueOf();


	ato.duration = ato.pRemainder;

	if (ato.duration < 0) {
		ato.active = false;
		appendText("alarm expired while away:");
		hideBar(ato);
		return;
	} 

	ato.pausedAt = undefined;
	ato.paused = false;

	div.className = ato.className();

	ato.alarm = setAlarm(ato);
}

function pauseResume(input) {
	var ato;

	if (typeof input === 'number') {
		ato = getActiveTimer(input);
	}
	else if (typeof input === 'object') {
		ato = input;
	}

	if (ato.pausable && !ato.paused) {
		pause(ato);
	}


	else if (ato.paused) {
		resume(ato);
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
		if (ato.stoppable){
			var stop = document.createElement("button");
			stop.id = "barStopButton" + ato.id;
			stop.innerHTML = "Stop";
			stop.className = "barButton barStopButton";
			stop.setAttribute("onclick","stopTimer(" + ato.id + ")");
			div.appendChild(stop);
		}
		if (ato.pausable){
			var pause = document.createElement("button");
			pause.id = "barPauseButton" + ato.id;
			pause.innerHTML = "Pause";
			pause.className = "barButton barPauseButton";
			pause.setAttribute("onclick","pauseResume(" + ato.id + ")");
			div.appendChild(pause);
		}


		return div;
	}

	var newBar = bar(ato);
	if (ato.pausable || ato.stoppable){
		newBar.appendChild(barButtons(ato));
	}

	bars.appendChild(newBar);

	if (ato.location == "box"){
		grid.spawn(ato);
	}
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
	attachToGrid = function(ato) {

		var target = document.getElementById(ato.location + "bar" + ato.id).getBoundingClientRect();
		var bar = document.getElementById("bar" + ato.id);

		bar.style.top = target.top + "px";
		bar.style.bottom = "calc(100% - " + target.bottom + "px)";
		bar.style.left = target.left + "px";
		bar.style.right = "calc(100% - " + target.right + "px)";
	}

	if (debug2) { return; } //DEBUG

	var now = new Date().valueOf();
	var num = activeTimers.length;

	for (i = 0; i < num; i++){
		var current = activeTimers[i]; // get current ato from all in array.
		if (current.location == "box" || current.needsRefresh || current.active && !current.paused){

			if (current.location == "box") { attachToGrid(current); }
			if (current.location == "recipe") { attachToGrid(current); }


			var bar = document.getElementById("progress" + current.id);

			var start = current.start;
			var end = current.finish;
			var elapsed = now-start;
			var total = end-start;
			var remainder = total-elapsed;

			if (current.needsRefresh == true) {
				current.needsRefresh = false;

				remainder = current.pRemainder;
				elapsed = current.pElapsed; 
				total = current.duration;
			}

			var elapsedFraction = (elapsed/total*100);

			if (elapsedFraction > 100) 	{ elapsedFraction = 100; }

			if (current.inverted) 	{ widthPercent = 100-elapsedFraction; }
			else 							{ widthPercent = elapsedFraction; }

				var countdown = document.getElementById("barcountdown" + current.id);
				var ms = 			document.getElementById("barcountdownms" + current.id);
			if (current.countdown) { //countdown for countdowns
				countdown.innerHTML 				= renderTime(remainder);
				ms.innerHTML = (msVisible) ? renderMs(remainder) : "";
			} else if (!current.duration) { //render elapsed time for wait events
				countdown.innerHTML = renderTime(elapsed);
				ms.innerHTML = (msVisible) ? renderMs(elapsed) : "";
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

			if (sounds[fave.soundID].looping){
				faveButton.className = faveButton.className + " loop";
			}


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
		x[i].className = x[i].className + "deleted";
	}
	li.style.padding = 0;
	li.className = li.className + "deleted";

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
	maintext.className = (timeStamps) ? "maintext" : "maintext no-timestamps"
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

	saveActiveTimers();

	function checkProtect() {
		for (var i = 0; i < activeTimers.length; i++) {
			if (activeTimers[i].protected && activeTimers[i].active) { return true; }
		}
		return false;
	}

	if (debug2) {
		localStorage.setItem('trigger','trigger');
	}

	else if (checkProtect()) { return "Timers running, close?"; }	
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

		appendText("debug1 = "  + debug1);

		appendText("debug2 = " + debug2);


	}
}

function clearEnable() {
	var check = danger.checked;
	deleteDataButton.disabled = (check);
	appendText("button enabled = " + check, "debug");
}

function clearLocalStorage() {
	debug2 = true;
	document.location.reload();
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



function Recipe(){
	var flour = 400;
	var water = 230;
	var starter = 160;
	var salt = "~5-7"
	//not in actual bakers percentage, but water content to whole weight ratio.
	//thats 0.5 for 100% hydration etc.
	var starterHydration = 0.5;

	function Ingredient(name, amount, unit = "g") {

		this.name = name;
		this.amount = amount;
		this.unit = unit;

		Object.defineProperties(this, { 
			'hydration': {
				enumerable:false,
				writable: true
			}, 'isIngredient':{
				value:true
			}

		});				
				
		if (name == "flour"){
			this.hydration = 0;
		} 
		else if (name == "water"){
			this.hydration = 1;
		} 
		else if (name == "starter"){
			this.hydration = starterHydration;
		}

		Ingredient.prototype.getStr = function(){
			var string = "";
			string = this.name + ": " + this.amount + this.unit;
			return string;
		}
	}

	Recipe.prototype.getIngredients = function(){
		var thing = Object.entries(this);
		var boo = [];

		for (var i = 0;i < thing.length;i++){
			if (!!thing[i][1].isIngredient){

				boo.push(thing[i][1].getStr());
		
			}
		}

		if (arguments[0] == "ul"){
			var ul = document.createElement("ul");
			for (var i = 0;i < boo.length;i++){
				var li = document.createElement("li");
				var text = document.createTextNode(boo[i]);

				li.appendChild(text);
				ul.appendChild(li);
			}
			return ul;
		}

		else return boo;
	}

	function TimeEvent(duration = 5000,text){
		this.location = "recipe";
		this.duration = duration;
		this.text = text;
	}

	function WaitEvent(estimate, text){
		this.location = "recipe";
		this.duration = false;
		this.estimate = estimate;
		this.text = text;
		this.countdown = false;
	}

	Recipe.prototype.nextEvent = function(){
		if (this.events.length > 0){

			var nte = this.events.shift();
			startTimer(nte);
		}
	}

	Object.defineProperties(this,{
		"id":{
			value: 1
		}, 
		"name":{
			value: "mydeliciousbread",
			enumerable: false,
			writable: true
		},
		"eventCount":{
			value: 3,		// dummy value
			enumerable: false,
			writable: true
		},
		"hasWindow":{
			value: false,
			writable: true
		}
	});

	this.events = [
		new WaitEvent(10000,"wait, mixing and kneading"),
		new TimeEvent(50000,"first rise"),
		new WaitEvent(10000,"wait, "),
		new TimeEvent(13000,"second rise"),
		new WaitEvent(10000,"wait, shaping"),
		new TimeEvent(10000,"cook with lid"),
		new TimeEvent(10000,"cook without lid (total cooking time)"),
		new TimeEvent(10000000,"let cool....")
	];

	this.flour = flour = new Ingredient("flour",flour);
	this.water = water = new Ingredient("water",water);
	this.starter = starter = new Ingredient("starter",starter);
	this.salt = salt = new Ingredient("salt",salt);

	if (arguments.length>1 && typeof arguments[0] === "string"){
		var x = Math.floor(arguments.length/2)*2; //gets an even number.

		for(var i=0;i<x;i = i + 2){
			var ingred = new Ingredient(arguments[i],arguments[i+1]);
			Object.defineProperty(this,arguments[i],{
				enumerable:true,
				value:ingred
			});
		}
	}

	if (starterHydration) { 
		this.hydration = (function(){
			var starterWater = (starter.amount*starter.hydration);
			var starterFlour = (starter.amount*(1-starter.hydration))

			hydr = (water.amount+starterWater)/(flour.amount+starterFlour);
			hydr = hydr.toFixed(2);
			return hydr;
		}()); 

		Object.defineProperty(this, 'hydration', {
			enumerable:false
		});
	}
	
}

var seeds = new Recipe("seeds",200);
var myBread = new Recipe();
var pepperBread = new Recipe("pepper",100);
