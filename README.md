# whispr-bridge

Phone-to-desktop voice dictation relay. Dictate with [WisprFlow](https://wisprflow.ai) on your phone, send text to your Linux desktop — typed at cursor or copied to clipboard.

## How it works

1. Bun server runs on your desktop, serves a simple web UI
2. Open the web UI on your phone (same network or Tailscale)
3. Tap the textarea, dictate with WisprFlow
4. Hit send — text gets injected on your desktop via `wtype` or `wl-copy`

## Requirements

- Linux with Wayland (built for Hyprland)
- [Bun](https://bun.sh)
- `wtype` and `wl-copy` installed
- Phone and desktop reachable over network (LAN or Tailscale)

## Setup

```bash
bun install
```

## Usage

```bash
bun run dev
```

Open the network URL shown in the terminal on your phone.

## Modes

- **Type at Cursor** — simulates keystrokes via `wtype`, works in most apps and terminals
- **Clipboard** — copies to clipboard via `wl-copy`, paste manually where needed

## Run as a persistent service

To keep whispr-bridge running across reboots and auto-restart on crashes, set it up as a systemd user service.

Create the service file at `~/.config/systemd/user/whispr-bridge.service`:

```ini
[Unit]
Description=Whispr Bridge - Phone to desktop voice dictation relay
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/whispr-bridge
ExecStart=/path/to/.bun/bin/bun run start
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
```

Update `WorkingDirectory` and `ExecStart` with your actual paths.

Enable and start:

```bash
systemctl --user daemon-reload
systemctl --user enable --now whispr-bridge
```

Useful commands:

```bash
systemctl --user status whispr-bridge     # check status
systemctl --user restart whispr-bridge    # restart (e.g. after code changes)
systemctl --user stop whispr-bridge       # stop
journalctl --user -u whispr-bridge -f     # tail logs
```

> **Note:** The service runs `bun run start` (no hot reload). If you change the code, restart the service to pick up changes.

## PWA install

To install as an app on your phone, open the web UI in Chrome. Since the server runs over HTTP, you'll need to allow it as a secure origin:

1. On your phone, open `chrome://flags` in Chrome
2. Search for **"Unsafely treat insecure origin as secure"**
3. Add your server URL (e.g. `http://100.x.x.x:3777`)
4. Set to **Enabled** and relaunch Chrome
5. Open the server URL, tap the three dots menu, and select **Install app**
