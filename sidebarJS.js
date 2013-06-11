var deleteToggled = false;
var content;

function createNote(content) {
	var mirror = document.createElement("div");
	mirror.style.visibility = "hidden";
	mirror.className = "mirror";
	mirror.style.wordWrap="break-word";

	var note = document.createElement("textarea");
	note.className = "note";
	if(content != null){note.value = content;}
	if(!deleteToggled) {
		note.style.outline = "2px auto -webkit-focus-ring-color";
	}else{
		note.style.outline = "2px auto red";
	}
	note.style.resize="none";
	note.style.overflow = "hidden";

	note.addEventListener('input', function (event) {
		mirror.innerHTML = note.value;
		note.style.height = (mirror.offsetHeight - 2) + "px";
		console.log(mirror.offsetHeight);

		exportNotes();
	}, false );

	note.onfocus = function() {
		if(!deleteToggled){
			if(!note.readOnly) {
				note.style.outline = "2px auto -webkit-focus-ring-color";
			}else{
				note.style.outline = "none";
			}
		}
	}
	note.onblur = function() {
		if(!deleteToggled) {
			note.style.outline = "none";
		}
	}
	note.addEventListener("dblclick", function() {
		note.readOnly = !note.readOnly;
		if(!deleteToggled){
			if(!note.readOnly) {
				note.style.outline = "2px auto -webkit-focus-ring-color";
			}else{
				note.style.outline = "none";
			}
		}
	});

	var delNote = document.createElement("input");
	delNote.type = "submit";
	delNote.className = "delNote";
	delNote.value = "Delete Note";
	if(!deleteToggled) {
		delNote.style.visibility = "hidden";
		delNote.style.outline = "2px auto red";
	}else{
		delNote.style.visibility = "visible";
	}
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
	note.focus();
}


function toggleDelete() {
	console.log("toggleDelete called!");
	var list = document.getElementById("AppContent").childNodes;
	for(var i=0; i<list.length; i++) {
		if(list.item(i).className == "noteWrapper") {
			if(!deleteToggled) {
				list.item(i).childNodes.item(2).style.visibility = "visible";
				list.item(i).childNodes.item(0).style.outline = "2px auto red";
			}else{
				list.item(i).childNodes.item(2).style.visibility = "hidden";
				list.item(i).childNodes.item(0).style.outline = "none";
			}
		}
	}
	deleteToggled = !deleteToggled;
}

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
	link.innerHTML = "<button id='export' type='button'></button>";
	link.id = "download_link";
	link.style.width = "100px";
	link.style.height = "100px";
	document.getElementById("button").appendChild(link);
}