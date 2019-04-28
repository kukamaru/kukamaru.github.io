var myVar = setInterval(myTimer, 11);

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
	document.getElementById("text4").innerHTML = ":" + ms;
}