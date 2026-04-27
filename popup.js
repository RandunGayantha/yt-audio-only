// popup.js
const toggleCard = document.getElementById('toggleCard');
const switchEl = document.getElementById('switch');
const dot = document.getElementById('dot');
const statusText = document.getElementById('statusText');
const reloadNotice = document.getElementById('reloadNotice');
const reloadBtn = document.getElementById('reloadBtn');
const toggleIcon = toggleCard.querySelector('.toggle-icon');

let currentState = false;

function setUI(enabled) {
  currentState = enabled;
  if (enabled) {
    toggleCard.classList.add('active');
    switchEl.classList.add('on');
    dot.classList.add('active');
    statusText.classList.add('active');
    statusText.textContent = 'Active — video hidden, audio playing';
    toggleIcon.textContent = '🎵';
  } else {
    toggleCard.classList.remove('active');
    switchEl.classList.remove('on');
    dot.classList.remove('active');
    statusText.classList.remove('active');
    statusText.textContent = 'Disabled — video playing normally';
    toggleIcon.textContent = '🔇';
  }
}

// Load current state
chrome.storage.sync.get(['audioOnly'], (result) => {
  setUI(result.audioOnly === true);
});

// Toggle on click
toggleCard.addEventListener('click', () => {
  const newState = !currentState;
  chrome.storage.sync.set({ audioOnly: newState }, () => {
    setUI(newState);
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'TOGGLE_AUDIO_ONLY',
          enabled: newState
        }, (response) => {
          if (chrome.runtime.lastError) {
            // Content script might not be ready, show reload
            reloadNotice.classList.add('show');
          }
        });
        reloadNotice.classList.add('show');
      } else {
        reloadNotice.classList.add('show');
      }
    });
  });
});

// Reload button
reloadBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    }
  });
});
