var myVar = setInterval(myTimer, 11);
var msVisible = true;

function msVisCheck() {
	var checkBox = document.getElementById("msCheck");
	var text = document.getElementById("text4");
	if (checkBox.checked == true) {	
		text.style.display = "inline";
		msVisible = true;
	}
	else { 
		text.style.display = "none";
		msVisible = false;
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
	var start = Date.now();
	console.log("button pressed: " + start);
	setTimeout(function(){ 
		console.log("time elapsed");
		appendText("BOING:" + start); 
	}, 2000)
}

function appendText(i) {
	var currentText = document.getElementById("maintext").innerHTML;
	var newText = currentText +"<p>"+ i +"</p>";
	document.getElementById("maintext").innerHTML = newText;
}