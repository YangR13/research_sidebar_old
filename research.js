chrome.runtime.onMessage.addListener(
	function(msg, sender) {
		console.log("msg processed!");
		if(msg == "initiate")
			toggle();
	});

var webpage;
var sidebar;
var isActive;

window.onload = function() {
	checkStatus();
}

window.onresize = function(){
	if(isActive) {
		webpage.style.width = (document.body.clientWidth - 350)+"px";
		webpage.style.height = $(document).height() + "px";
		sidebar.style.height = window.innerHeight + "px";
	}
}

function checkStatus() {
	chrome.storage.local.get(function(data) {
		if(data.active) {
			createPages();
			moveNodes();
			loadPages();
		}
		isActive = data.active;
		console.log("isActive: "+isActive);
	});
}

function toggle() {
	if(!isActive) {
		chrome.storage.local.set({'active': true}, function() {
			console.log("Sidebar is ACTIVE");
		});
	}else{
		chrome.storage.local.set({'active': false}, function() {
			console.log("Sidebar is NOT ACTIVE");
		});
		resetPages();
	}
	checkStatus();
}

function createPages() {
	webpage = document.createElement("div");
	webpage.id = "AppWebpage";
	webpage.style.width = (document.body.clientWidth - 350)+"px";
	webpage.style.height = $(document).height() + "px";
	webpage.style.position = "relative";
	webpage.style.cssFloat = "left";

	sidebar = document.createElement("div");
	sidebar.id = "AppContainer";
	sidebar.style.width = "350px";
	sidebar.style.height = window.innerHeight + "px";
	sidebar.style.position = "fixed";
	sidebar.style.top = "0px";
	sidebar.style.right = "0px";
	sidebar.style.overflow = "hidden";
	sidebar.style.zIndex = "10";
}

function moveNodes() {
	var list = document.body;
	var node = list.firstChild;
	while(node) {
		clone = node.cloneNode(true);
		webpage.appendChild(clone);
		node = node.nextSibling;
	}
	//console.log(window.getComputedStyle(document.body));
}

function loadPages() {
	document.body.innerHTML = "";
	document.body.style.margin = "0px";
	document.body.appendChild(webpage);
	document.body.appendChild(sidebar);
	$('#AppContainer').load(chrome.extension.getURL("sidebar.html"), function() {
		$('#AppContainer').append('<link rel="stylesheet" type="text/css" href="'+chrome.extension.getURL("sidebarStyle.css")+'">');
		$('#AppContainer').append('<link rel="stylesheet" type="text/css" href="'+chrome.extension.getURL("toolkitStyle.css")+'">');
		$('#AppContainer').append('<script src="'+chrome.extension.getURL("sidebarJS.js")+'"></script>');
		$('#AppContainer').append('<script src="'+chrome.extension.getURL("toolkitJS.js")+'"></script>');
		loadSavedText(function() {
			loadSavedData(function(){
				addListeners()
			});
		});
	});
}

function resetPages() {
	var list = webpage;
	var node = list.firstChild;
	while(node) {
		clone = node.cloneNode(true);
		document.body.appendChild(clone);
		node = node.nextSibling;
	}
	document.body.removeChild(webpage);
	document.body.removeChild(sidebar);
}

function addListeners() {
	document.getElementsByName("list_add").item(0).addEventListener('click', function() {
		saveLinks();

		//Adds listeners to list_remove buttons
		console.log("list_remove listener added");
		console.log(document.getElementsByName("list_remove").length-1);
		document.getElementsByName("list_remove").item(document.getElementsByName("list_remove").length-1).addEventListener('click', function() {
			saveLinks();
		});
	});
	
	for(var i=0; i<document.getElementsByName("list_remove").length; i++){
		document.getElementsByName("list_remove").item(i).addEventListener('click', function() {
			saveLinks();
			console.log("added Event Listener to list_remove");
		});
	}
	setInterval(function(){saveNotes()}, 2000);
}
// function saveText() {
// 	var noteContent = (document.getElementById("text_written")).value;

// 	chrome.storage.local.set({'content': noteContent}, function() {
// 		console.log("Notes have been saved");
// 		console.log(noteContent);
// 	});
// }

function saveNotes(){
	var noteArr = new Array;
	var list = document.getElementById("AppContent").childNodes;
	for(var i=0; i<list.length; i++) {
		if(list.item(i).className == "noteWrapper") {
			if(list.item(i).childNodes.item(0).value != "") {
				console.log(list.item(i).childNodes.item(0).value);
				noteArr.push(list.item(i).childNodes.item(0).value);
			}
		}
	}
	chrome.storage.local.set({'noteArr': noteArr}, function() {
		console.log("Notes have been saved");
		console.log(noteArr);
	});
	console.log("Saving Notes!");
}

function loadSavedText(callback) {
	chrome.storage.local.get(function(data) {
		var data = data.noteArr;
		if(data != null) {
			for(var i=0; i<data.length; i++){
				createNote(data[i]);
			}
		}
		if(callback != null) {callback();}
	});
}

function loadSavedData(callback) {
	chrome.storage.local.get(function(data) {
		var data = data.link_list;
		var container = document.getElementById("link_container");
		if(data != null) {container.innerHTML = data;}
		if(callback != null) {callback();}
	});
}

function saveLinks() {
	var container = document.getElementById("link_container");
	var data = container.innerHTML;
	console.log(data);

	chrome.storage.local.set({'link_list': data}, function() {
		console.log("Link list has been saved!");
	});
	
}

//CREATE NOTE function
function createNote(content) {
	var mirror = document.createElement("div");
	mirror.style.visibility = "hidden";
	mirror.className = "mirror";
	mirror.style.wordWrap="break-word";

	var note = document.createElement("textarea");
	note.className = "note";
	if(content != null){note.value = content;}
	note.style.outline = "none";
	note.style.resize="none";
	note.style.overflow = "hidden";

	note.addEventListener('input', function (event) {
		mirror.innerHTML = note.value;
		note.style.height = (mirror.offsetHeight - 2) + "px";
		console.log(mirror.offsetHeight);
		exportNotes();
	}, false );

	note.onfocus = function() {
		if(!note.readOnly) {
			note.style.outline = "2px auto -webkit-focus-ring-color";
		}else{
			note.style.outline = "none";
		}
	}
	note.onblur = function() {
		note.style.outline = "none";
	}
	note.addEventListener("dblclick", function() {
		note.readOnly = !note.readOnly;
		if(!note.readOnly) {
			note.style.outline = "2px auto -webkit-focus-ring-color";
		}else{
			note.style.outline = "none";
		}
	});

	var delNote = document.createElement("input");
	delNote.type = "submit";
	delNote.className = "delNote";
	delNote.value = "Delete Note";
	delNote.style.visibility = "hidden";
	
	delNote.onclick = function() {
		document.getElementById("AppContent").removeChild(noteWrapper);
		exportNotes();
	}

	var noteWrapper = document.createElement("div");
	noteWrapper.className = "noteWrapper";

	noteWrapper.appendChild(note);
	noteWrapper.appendChild(mirror);
	noteWrapper.appendChild(delNote);

	document.getElementById("AppContent").appendChild(noteWrapper);
}

//SETCONTENT AND EXPORT
function setContent() {
	content = "";
	var list = document.getElementById("AppContent").childNodes;
	for(var i=0; i<list.length; i++) {
		if(list.item(i).className == "noteWrapper") {
			console.log(list.item(i).childNodes.item(0).value);
			if(content != "") {content += "\n\n";}
			content += list.item(i).childNodes.item(0).value;
		}
	}
	console.log(content);
}

function exportNotes() {
	console.log("Exporting Notes!");
	setContent();
	var link = document.getElementById("download_link");
	if(link != null) {
		link.parentNode.removeChild(link);
	}
	window.URL = window.URL || window.webkitURL;

	var blob = new Blob([content], {type: 'text/plain', ending: 'native'});

	var link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = "notes.txt";
	link.innerHTML = "<button id='export' type='button'>E</button>";
	link.id = "download_link";
	link.style.width = "100px";
	link.style.height = "100px";
	document.getElementById("button").appendChild(link);
}