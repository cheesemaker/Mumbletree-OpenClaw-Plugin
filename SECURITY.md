# Security policy

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting for this repository. Do not
open a public issue containing credentials, pairing codes, private messages,
channel identifiers, or server configuration.

## Credential handling

The plugin stores bot credentials outside `openclaw.json` under
`~/.openclaw/credentials/mumbletree-chat/`. Credentials must remain readable
only by the OpenClaw operating-system account. Revoke a credential from
Mumbletree administration if it may have been exposed.

Pairing codes are short-lived and single-use, but should still be treated as
sensitive until claimed or expired.
