var moveToggle = false;
var toggleNum = 1;
var numLinks = 0;

var button1 = function() {
	if (!moveToggle) {
		toggle();
		document.getElementById('mindy1').style.display = "block";
	} else if (numToggle == 1) {
		toggle();
		document.getElementById('mindy1').style.display = "none";
	} else {
		document.getElementById('mindy1').style.display = "block";
	}
	numToggle = 1;
	document.getElementById('mindy2').style.display = "none";
	document.getElementById('mindy3').style.display = "none";
}
var button2 = function() {
	if (!moveToggle) {
		toggle();
		document.getElementById('mindy2').style.display = "block";
	} else if (numToggle == 2) {
		toggle();
		document.getElementById('mindy2').style.display = "none";
	} else {
		document.getElementById('mindy2').style.display = "block";
	}
	numToggle = 2;
	document.getElementById('mindy1').style.display = "none";
	document.getElementById('mindy3').style.display = "none";
}
var button3 = function() {
	if (!moveToggle) {
		toggle();
		document.getElementById('mindy3').style.display = "block";
	} else if (numToggle == 3) {
		toggle();
		document.getElementById('mindy3').style.display = "none";
	} else {
		document.getElementById('mindy3').style.display = "block";
	}
	numToggle = 3;
	document.getElementById('mindy1').style.display = "none";
	document.getElementById('mindy2').style.display = "none";
}
var toggle = function() {
	if (moveToggle) {
		document.getElementById('buttons').style.marginBottom = "0px";
		document.getElementById("AppSidebar").style.height = "calc(100% - 30px)";
		// $("#AppBottom").animate({height:"30px"});
		// $("#AppSidebar").animate({height:"calc(100% - 30px)"});
		moveToggle = false;
	} else {
		document.getElementById('buttons').style.marginBottom = "300px";
		document.getElementById("AppSidebar").style.height = "calc(100% - 330px)";
		// $("#AppBottom").animate({height:"330px"});
		// $("#AppSidebar").animate({height:"calc(100% - 330px)"});
		moveToggle = true;
	}
}

var newLink = function() {
		var title = document.title;
		var link = document.URL;
		var mindy1Var = document.createElement("span");
		mindy1Var.className = "lenkuDesu";
		mindy1Var.innerHTML = "<a href = '" + link + "'>" + title +' '+ "</a><input class = 'delete_button' name='list_remove' type='submit' value='X' onclick='deleteLink(this);'/></br>";
		document.getElementById('link_container').appendChild(mindy1Var);
}

var deleteLink = function(button) {
	document.getElementById('link_container').removeChild(button.parentNode);
}