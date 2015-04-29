var tabs = new Array();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == 'complete' && tab.url.match(".+://chat.stackexchange.com/rooms/.*")) {
		tabs.push(tabId);
		chrome.tabs.executeScript(tabId, {code:"var	s = document.createElement('script');" +
											   "s.src = chrome.extension.getURL('Jax.js');" +
											   "(document.head||document.documentElement).appendChild(s);"});
	}
});