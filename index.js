import { defineChannelPluginEntry } from "openclaw/plugin-sdk/core";
import { mumbletreeChatPlugin } from "./src/channel.js";
import { registerPairingCli } from "./src/pairing-cli.js";

export default defineChannelPluginEntry({
  id: "mumbletree-chat",
  name: "Mumbletree Chat",
  description: "Mumbletree Chat channel plugin",
  plugin: mumbletreeChatPlugin,
  registerCliMetadata(api) {
    api.registerCli((ctx) => registerPairingCli(ctx, api.runtime), {
      commands: ["mumbletree-chat"],
      descriptors: [
        { name: "mumbletree-chat", description: "Manage Mumbletree Chat pairing", hasSubcommands: true }
      ]
    });
  }
});
