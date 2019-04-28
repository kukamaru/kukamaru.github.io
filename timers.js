var myVar = setInterval(function() {
	myTimer();
}, 1000);

function myTimer() {
	var d = new Date();
	document.getElementById("text1").innerHTML = d.toLocaleTimeString();
}