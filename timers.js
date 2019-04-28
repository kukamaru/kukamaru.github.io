var myVar = setInterval(myTimer, 1);

function myTimer() {
	var d = new Date();

	hours = d.getHours();
	minutes = d.getMinutes();
	seconds = d.getSeconds();
	ms = d.getMilliseconds();


	document.getElementById("text1").innerHTML = hours;
	document.getElementById("text2").innerHTML = minutes;
	document.getElementById("text3").innerHTML = seconds;
	document.getElementById("text4").innerHTML = ms;

}