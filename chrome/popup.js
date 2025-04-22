document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('modeToggle');
  
    chrome.storage.local.get('netflixPanelMode', (data) => {
      toggle.checked = (data.netflixPanelMode || 'always') === 'always' ? 'modal' : 'always';
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'REFRESH_PANEL' });
      });
    });
    toggle.addEventListener('change', () => {
        const newValue = toggle.checked ? 'always' : 'modal';
        chrome.storage.local.set({ netflixPanelMode: newValue }, () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'REFRESH_PANEL' });
          });
        });
      });
      
  });
  