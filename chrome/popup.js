document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('modeToggle');
  
    chrome.storage.local.get('netflixPanelMode', (data) => {
      const mode = data.netflixPanelMode || 'always';
      toggle.checked = mode === 'always';
      document.body.style.visibility = 'visible';
    });
  
    toggle.addEventListener('change', () => {
      const newMode = toggle.checked ? 'always' : 'modal';
      chrome.storage.local.set({ netflixPanelMode: newMode }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'REFRESH_PANEL' });
        });
      });
    });
  });
  