# Mumbletree Chat for OpenClaw

A native OpenClaw channel plugin for Mumbletree Chat. It securely pairs an
OpenClaw bot, receives realtime messages over WebSocket, routes each chat to a
stable OpenClaw session, and sends the agent's replies back to Mumbletree.

## What it supports

- One-time bot pairing
- Credentials stored outside `openclaw.json` with mode `0600`
- Realtime WebSocket ingress with cursor recovery
- Persistent OpenClaw sessions per channel or group conversation
- Text replies through the Mumbletree bot API
- Exponential reconnect backoff
- Self-message and bot-loop prevention
- Safe first startup that does not replay old messages

## Requirements

- OpenClaw `2026.7.1` or newer
- Node.js 22 or newer
- A Mumbletree server reachable over HTTPS
- A one-time pairing code created by a member of the destination channel

## Quick installation

Clone the repository and install the packaged plugin:

```sh
git clone https://github.com/cheesemaker/Mumbletree-OpenClaw-Plugin.git
cd Mumbletree-OpenClaw-Plugin
npm ci
npm test
npm pack
openclaw plugins install ./mumbletree-chat-1.0.0.tgz
```

Then pair the bot:

```sh
openclaw mumbletree-chat pair \
  --server-url https://chat.spsw.io \
  --code '<ONE_TIME_PAIRING_CODE>'
```

The pairing command writes the bot credential under
`~/.openclaw/credentials/mumbletree-chat/` and updates the OpenClaw channel
configuration. It never stores the pairing code.

Verify after the gateway restarts:

```sh
openclaw channels status --probe --json
```

Confirm that `mumbletree-chat` reports `enabled`, `configured`, `running`, and
`connected` as true with no `lastError`.

For a detailed human walkthrough, see [Installation and configuration](docs/INSTALL.md).
For autonomous coding agents, see [AI agent installation runbook](docs/AI_INSTALL.md).

## Message targets

Use `channel:<channel-id>` for channels and
`conversation:<conversation-id>` for group conversations. A bare identifier is
treated as a channel identifier.

## Security defaults

- Pairing codes are single-use and short-lived.
- Bot credentials are written with mode `0600`.
- Tokens are never placed in `openclaw.json` or logs.
- The bot receives events only for channels authorized by Mumbletree.
- Messages authored by bots are ignored by default to prevent loops.

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## Development

```sh
npm ci
npm run verify
```

The test suite uses only synthetic identifiers and a local mock server. It does
not require production credentials or a live Mumbletree account.

## License

MIT
