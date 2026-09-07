# Installation and configuration

## 1. Create a pairing invitation

In the Mumbletree mobile client, open the channel where the bot should
participate and create an OpenClaw bot pairing invitation. Select only the
channels and permissions the bot needs. Copy the one-time pairing code.

The code expires after 15 minutes and can be claimed only once.

## 2. Install the plugin

```sh
git clone https://github.com/cheesemaker/Mumbletree-OpenClaw-Plugin.git
cd Mumbletree-OpenClaw-Plugin
npm ci
npm run verify
npm pack
openclaw plugins install ./mumbletree-chat-1.0.0.tgz
```

If OpenClaw reports that the plugin is already installed, follow the upgrade
steps below instead of deleting its files manually.

## 3. Pair OpenClaw

```sh
openclaw mumbletree-chat pair \
  --server-url https://chat.spsw.io \
  --code '<ONE_TIME_PAIRING_CODE>' \
  --label 'My OpenClaw Bot'
```

Optional flags:

- `--account <id>` selects an OpenClaw channel account; the default is
  `default`.
- `--server-url <url>` selects another compatible Mumbletree deployment.
- `--label <text>` labels the credential in Mumbletree administration.

The command stores the returned credential at:

```text
~/.openclaw/credentials/mumbletree-chat/<account>.json
```

The directory is mode `0700` and the credential is mode `0600`.

## 4. Verify the connection

```sh
openclaw plugins inspect mumbletree-chat --runtime --json
openclaw channels status --probe --json
```

Expected channel state:

```json
{
  "enabled": true,
  "configured": true,
  "running": true,
  "connected": true,
  "reconnectAttempts": 0,
  "lastError": null
}
```

Send a new message in an authorized Mumbletree channel. The plugin intentionally
does not replay messages that predate its first startup.

## Configuration

The pairing command creates the required channel configuration. Available
properties under `channels.mumbletree-chat` are:

- `enabled`: Enables the channel account.
- `serverUrl`: Base URL of the Mumbletree server.
- `credentialFile`: Path to the protected credential JSON.
- `defaultTo`: Optional default outbound target, such as `channel:chn_...`.
- `respondToBots`: Allow bot-authored inbound messages. Defaults to `false` and
  should remain false unless the operator has designed explicit loop controls.

## Upgrade

```sh
git pull --ff-only
npm ci
npm run verify
npm pack
openclaw plugins install ./mumbletree-chat-1.0.0.tgz
openclaw gateway restart
openclaw channels status --probe --json
```

Back up `~/.openclaw/openclaw.json` before upgrading. Plugin upgrades do not
need a new pairing code unless the credential was revoked.

## Disable or recover

If the plugin causes gateway trouble, disable both the channel account and the
plugin before restarting:

```sh
openclaw config set channels.mumbletree-chat.enabled false
openclaw plugins disable mumbletree-chat
openclaw gateway restart
```

Do not delete the credential while diagnosing; disabling is reversible. Revoke
the bot in Mumbletree only when access should be permanently removed.

## Troubleshooting

- `Pairing failed`: Create a fresh pairing code and confirm the server URL.
- `configured: false`: Confirm that `credentialFile` exists and is readable by
  the account running OpenClaw.
- `connected: false`: Check `lastError`, server `/health` and `/ready`, DNS, and
  outbound TLS access.
- Messages do not arrive: Confirm the message is new, the bot is authorized for
  that channel, and its permissions include `events:read` and `messages:read`.
- Replies fail: Confirm `messages:write` and inspect the gateway log without
  printing the credential file.
