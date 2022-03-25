function loadEditor() {
    // TODO
}

chrome.action.onClicked.addListener((tab) => {
  if(!tab.url.includes("https://github.com/*/blob/'*.json")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenPage
    });
  }
});
