<div align="center">
  <img src="icons/logo.png" alt="YT Audio Only Logo" width="120" />

  # YT Audio Only
  ### Play YouTube as audio — save up to 80% of mobile data

  ![Version](https://img.shields.io/badge/version-1.0-red?style=flat-square)
  ![Manifest](https://img.shields.io/badge/manifest-v3-blue?style=flat-square)
  ![Browser](https://img.shields.io/badge/browser-Chrome%20%7C%20Edge%20%7C%20Brave-green?style=flat-square)
  ![License](https://img.shields.io/badge/license-MIT-orange?style=flat-square)
  ![Made by](https://img.shields.io/badge/made%20by-Randun%20Labs-ff4500?style=flat-square)

</div>

---

## 📖 What is this?

**YT Audio Only** is a lightweight browser extension that hides the video layer on YouTube while keeping the audio playing perfectly. Great for listening to music, podcasts, tutorials, or any YouTube content when you don't need to watch — saving significant mobile data in the process.

> 💡 **Why?** YouTube video streams consume huge amounts of data. Audio-only mode can cut that by up to **80%**, making it ideal for limited data plans or slow connections.

---

## ✨ Features

- 🎵 **Audio-only playback** — video hidden, audio plays perfectly
- 💾 **~80% data savings** on YouTube streams
- ⚡ **One-click toggle** — turn on/off instantly from the toolbar
- 🎛️ **All controls work** — pause, seek, volume, captions still function
- 🔄 **YouTube SPA support** — works across page navigations without reloading
- 🔒 **Privacy first** — no data collected, no external servers, no tracking
- 🪶 **Tiny footprint** — lightweight, no heavy dependencies

---


## 🚀 Installation

### Option A — Load Unpacked (Developer Mode)

> Works on **Chrome**, **Microsoft Edge**, and **Brave**.

1. **Download** this repository:
   ```
   Click "Code" → "Download ZIP" → Extract the folder
   ```
   Or clone it:
   ```bash
   git clone https://github.com/RandunGayantha/yt-audio-only.git
   ```

2. **Open your browser's extension page:**
   | Browser | URL |
   |---------|-----|
   | Chrome | `chrome://extensions` |
   | Edge | `edge://extensions` |
   | Brave | `brave://extensions` |

3. **Enable Developer Mode** — toggle in the top-right corner

4. **Click "Load unpacked"** and select the `yt-audio-only` folder

5. **Done!** The 🎵 icon will appear in your browser toolbar

---

## 🎮 How to Use

1. Open **[youtube.com](https://youtube.com)** and start any video
2. Click the **YT Audio Only** icon in your toolbar
3. Toggle **"Audio Only Mode"** to ON
4. Click **Reload** when prompted
5. The video goes dark — but audio continues playing!

To turn it off, just toggle it back and reload.

---

## 📁 Project Structure

```
yt-audio-only/
├── manifest.json       # Extension config (Manifest V3)
├── content.js          # Core logic — intercepts & hides video on YouTube
├── background.js       # Service worker — handles install & state
├── popup.html          # Toolbar popup UI
├── popup.js            # Popup toggle logic
├── icons/
│   ├── logo.png        # Full-size logo (also used in popup)
│   ├── icon16.png      # Toolbar icon (16×16)
│   ├── icon48.png      # Extension page icon (48×48)
│   └── icon128.png     # Chrome Web Store icon (128×128)
└── README.md
```

---

## 🔧 How It Works

The extension uses three techniques together for maximum compatibility:

1. **MediaStream Track Disabling** — If YouTube uses a `MediaStream`, video tracks are disabled at the source
2. **CSS Visibility** — The video element is hidden visually so the GPU skips rendering it
3. **DOM Observer** — A `MutationObserver` watches for new `<video>` elements added dynamically (YouTube is a SPA)
4. **YouTube Player Patch** — Injects into page context to set playback quality to minimum

> **Note:** Modern YouTube streams video and audio as separate HTTP segments (DASH streaming). This extension hides and disables video rendering. For full stream-level blocking (which would require network-level interception), a more advanced setup would be needed — but this approach already delivers meaningful data savings.

---

## 🌐 Browser Compatibility

| Browser | Supported | Notes |
|---------|-----------|-------|
| Google Chrome | ✅ | Full support |
| Microsoft Edge | ✅ | Full support (Manifest V3 compatible) |
| Brave | ✅ | Full support |
| Firefox | ⚠️ | Needs Manifest V2 port |
| Safari | ❌ | Not supported |

---

## 🛡️ Permissions

This extension requests only what it needs:

| Permission | Reason |
|------------|--------|
| `storage` | Save your on/off toggle preference |
| `tabs` | Detect when you're on a YouTube tab |
| `activeTab` | Send toggle message to the current tab |
| `*://*.youtube.com/*` | Run the audio-only script on YouTube |
| `*://*.googlevideo.com/*` | YouTube's video CDN domain |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

### Ideas for contributions
- [ ] Firefox (Manifest V2) port
- [ ] Data usage counter / savings tracker
- [ ] Whitelist specific channels to always play video
- [ ] Keyboard shortcut support

---

## 📄 License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

<div align="center">

  **Developed by [Randun Labs](https://github.com/RandunGayantha)**

  *Made with ❤️ to save your data*

</div>
