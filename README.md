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
