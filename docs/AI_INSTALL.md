# AI agent installation runbook

This runbook is written for an AI coding or operations agent installing the
plugin on behalf of an OpenClaw operator.

## Goal

Install and pair the Mumbletree channel plugin while preserving the existing
OpenClaw configuration and keeping credentials out of logs, chat, commits, and
shell history wherever practical.

## Safety rules

1. Never print, inspect, commit, or transmit the bot credential.
2. Treat the one-time pairing code as sensitive until it is claimed.
3. Back up the OpenClaw configuration before changing it.
4. Do not remove or rewrite unrelated plugin/channel configuration.
5. Run tests before installing.
6. If the gateway becomes unhealthy, disable both Mumbletree flags and restart
   once. Do not repeatedly restart a failing gateway.
7. Do not claim success until the runtime reports connected and a new test
   message completes the inbound/outbound round trip.

## Inputs required from the operator

- Mumbletree server URL (default: `https://chat.spsw.io`)
- Fresh one-time pairing code
- Optional OpenClaw account ID and bot label

If the pairing code is missing or expired, stop and ask the operator to create
a new invitation. Do not invent or reuse a code.

## Procedure

### A. Preflight

```sh
node --version
openclaw --version
openclaw gateway status
```

Require Node.js 22+ and OpenClaw 2026.7.1+. Record the existing gateway state.

### B. Fetch and verify source

```sh
git clone https://github.com/cheesemaker/Mumbletree-OpenClaw-Plugin.git
cd Mumbletree-OpenClaw-Plugin
npm ci
npm run verify
```

Stop if tests, syntax checks, or package inspection fail.

### C. Back up configuration

Make a timestamped copy of `~/.openclaw/openclaw.json` with mode `0600`. Never
display its contents because it may contain credentials for unrelated channels.

### D. Build and install

```sh
npm pack
openclaw plugins install ./mumbletree-chat-1.0.0.tgz
```

### E. Pair

Avoid placing the pairing code into durable scripts. Run:

```sh
openclaw mumbletree-chat pair \
  --server-url '<MUMBLETREE_SERVER_URL>' \
  --code '<ONE_TIME_PAIRING_CODE>' \
  --label '<BOT_LABEL>'
```

Do not echo the code or include command output containing sensitive material in
the final report. The command should update configuration and restart the
gateway.

### F. Verify runtime

```sh
openclaw plugins inspect mumbletree-chat --runtime --json
openclaw channels status --probe --json
```

Require all of the following:

- Gateway is reachable.
- Existing channels remain healthy.
- `mumbletree-chat` is enabled, configured, running, and connected.
- `lastError` is null.
- Reconnect attempts are zero or stable rather than increasing.

Then ask the operator to send one new message in an authorized channel. Confirm
that OpenClaw receives it and posts exactly one reply.

### G. Failure rollback

If gateway health or another channel regresses:

```sh
openclaw config set channels.mumbletree-chat.enabled false
openclaw plugins disable mumbletree-chat
openclaw gateway restart
```

Verify the gateway and pre-existing channels recover. Preserve logs and the
credential for diagnosis, but redact tokens and message content from reports.

## Completion report

Report:

- Installed plugin version and source commit
- Test result
- Plugin enabled/configured/running/connected state
- Whether a new-message round trip succeeded
- Whether existing channels remained healthy
- Any redacted error codes

Never report the pairing code or bot credential.
