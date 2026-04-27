// YT Audio Only - Content Script
// Runs on YouTube pages and disables video rendering when enabled

(function () {
  'use strict';

  let audioOnlyEnabled = false;
  let observer = null;

  // Load saved state
  chrome.storage.sync.get(['audioOnly'], (result) => {
    audioOnlyEnabled = result.audioOnly === true;
    if (audioOnlyEnabled) {
      applyAudioOnly();
      injectStyles();
    }
  });

  // Listen for toggle messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOGGLE_AUDIO_ONLY') {
      audioOnlyEnabled = message.enabled;
      if (audioOnlyEnabled) {
        applyAudioOnly();
        injectStyles();
      } else {
        removeAudioOnly();
        removeStyles();
      }
      sendResponse({ success: true });
    }
    if (message.type === 'GET_STATUS') {
      sendResponse({ enabled: audioOnlyEnabled });
    }
  });

  function applyAudioOnly() {
    // Method 1: Hide all video elements visually and prevent rendering
    hideVideoElements();

    // Method 2: Override HTMLVideoElement to intercept new video elements
    interceptVideoElements();

    // Method 3: Watch for dynamically added videos
    startObserver();

    // Method 4: Try to force low-quality / audio-only via URL manipulation
    patchYouTubePlayer();
  }

  function removeAudioOnly() {
    // Restore video elements
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
      v.style.visibility = '';
      v.style.opacity = '';
      // Re-enable video tracks
      if (v.srcObject) {
        v.srcObject.getVideoTracks().forEach(t => t.enabled = true);
      }
    });

    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function hideVideoElements() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      suppressVideoTrack(video);
    });
  }

  function suppressVideoTrack(video) {
    if (!video) return;

    // Disable video tracks if using MediaStream
    if (video.srcObject instanceof MediaStream) {
      video.srcObject.getVideoTracks().forEach(track => {
        track.enabled = false;
      });
    }

    // Set playback to audio-only by overriding the video element rendering
    // We keep audio but make the video invisible to save decode resources
    video.style.visibility = 'hidden';

    // Listen for source changes
    video.addEventListener('loadedmetadata', () => {
      if (audioOnlyEnabled) {
        if (video.srcObject instanceof MediaStream) {
          video.srcObject.getVideoTracks().forEach(t => t.enabled = false);
        }
        video.style.visibility = 'hidden';
      }
    });

    // Mark as processed
    video.dataset.audioOnly = 'true';
  }

  function interceptVideoElements() {
    // Patch document.createElement to catch new video elements
    const origCreate = document.createElement.bind(document);
    document.createElement = function (tag, options) {
      const el = origCreate(tag, options);
      if (tag.toLowerCase() === 'video' && audioOnlyEnabled) {
        setTimeout(() => suppressVideoTrack(el), 0);
      }
      return el;
    };
  }

  function startObserver() {
    if (observer) observer.disconnect();
    observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === 'VIDEO') {
            suppressVideoTrack(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('video').forEach(v => suppressVideoTrack(v));
          }
        });
      });
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function patchYouTubePlayer() {
    // Inject a script into page context to access yt player API
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        // Try to access YouTube's internal player and set quality to audio
        function tryPatchPlayer() {
          const playerEl = document.getElementById('movie_player');
          if (playerEl && playerEl.setPlaybackQuality) {
            // This alone won't block video download in modern YT but reduces quality
            playerEl.setPlaybackQuality('tiny');
          }
        }
        // Try immediately and after navigation
        tryPatchPlayer();
        setTimeout(tryPatchPlayer, 2000);
        setTimeout(tryPatchPlayer, 5000);

        // Observe URL changes (YouTube is SPA)
        let lastUrl = location.href;
        new MutationObserver(() => {
          if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(tryPatchPlayer, 1500);
          }
        }).observe(document, { subtree: true, childList: true });
      })();
    `;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }

  function injectStyles() {
    if (document.getElementById('yt-audio-only-styles')) return;
    const style = document.createElement('style');
    style.id = 'yt-audio-only-styles';
    style.textContent = `
      /* Hide video layer, keep controls and audio */
      video[data-audio-only="true"],
      .html5-main-video {
        visibility: hidden !important;
      }

      /* Show a nice audio-only overlay */
      #movie_player .html5-video-container::after {
        content: '🎵 Audio Only Mode';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.85);
        color: #fff;
        font-size: 20px;
        font-family: 'YouTube Sans', sans-serif;
        padding: 16px 32px;
        border-radius: 12px;
        pointer-events: none;
        z-index: 9999;
        letter-spacing: 0.5px;
      }

      /* Keep controls visible */
      .ytp-chrome-bottom,
      .ytp-chrome-top {
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function removeStyles() {
    const s = document.getElementById('yt-audio-only-styles');
    if (s) s.remove();
  }

  // Handle YouTube SPA navigation (url changes without page reload)
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      if (audioOnlyEnabled) {
        setTimeout(() => {
          applyAudioOnly();
        }, 1500);
      }
    }
  }).observe(document, { subtree: true, childList: true });

})();
