chrome.browserAction.onClicked.addListener(function() {
	console.log("button clicked!");
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, "initiate");
	});
});
