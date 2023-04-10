chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	// If the tab being updated has not been completely loaded,
	if (changeInfo.status !== 'complete')
	{
		// ... exit and wait for complete events
		return;
	}

	// Chrome will generate onUpdated() events for all tabs, but we only
	//   have access to Stack Exchange chat. See manifest.json

	// If the current tab with a completed event is a Stack Exchange chat window,
	if (tab.url.match('.+://chat.stackexchange.com/rooms/.*'))
	{
		// ... then instruct the Chrome scripting API to inject a script,
		chrome.scripting.executeScript(
		{
			// ... for the current tab
			target:
			{
				tabId: tabId
			},
			function: () =>
			{
				// Create a script object
				var	s = document.createElement('script');
				// Set the script source to the Extension script
				s.src = chrome.runtime.getURL('Jax.js');

				// Append the script object to the page
				(document.head||document.documentElement).appendChild(s);
			},
		})
		.then(() => console.log("Injected script on tab: " + tab.url + " (" + tabId + ")"));
	}
});
