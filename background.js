var tabs = new Array();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == 'complete' && tab.url.match(".+://chat.stackexchange.com/rooms/.*")) {
		tabs.push(tabId);

		const functionToExecute = () => {
			var	s = document.createElement('script');
			s.src = chrome.runtime.getURL('Jax.js');
			(document.head||document.documentElement).appendChild(s);
		};

		chrome.scripting.executeScript({
			target: {tabId: tabId}, 
			function: functionToExecute,
			}
		)
		.then(() => console.log("injected script file"));
	}
});