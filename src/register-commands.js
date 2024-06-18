const { REST, Routes } = require("discord.js");
const { token, clientId, guildId } = require("../private");

const commands = [
  {
    name: "hello",
    description: "This is the first registered command.",
  },
  {
    name: "seraphim",
    description: "About Seraphim Euphony!",
  },
  {
    name: "zira",
    description: "About Zira Esports",
  },
  {
    name: "moon",
    description: "About Moon Nickname",
  },
  {
    name: "meme",
    description: "Fetch a random meme.",
  },
  {
    name: "avatar",
    description: "Display the avatar of a user.",
    options: [
      {
        name: "user",
        type: 6, // USER type
        description: "The user whose avatar you want to display.",
        required: false,
      },
    ],
  },
  {
    name: "profile",
    description: "Display the profile information of a user.",
    options: [
      {
        name: "user",
        type: 6, // USER type
        description: "The user whose profile you want to display.",
        required: false,
      },
    ],
  },
  {
    name: "sticky",
    description: "Mark a message as sticky.",
    options: [
      {
        name: "message",
        type: 3, // STRING type
        description: "The message to mark as sticky.",
        required: true,
      },
      {
        name: "channel",
        type: 7, // CHANNEL type
        description: "The channel where the sticky message will be displayed.",
        required: true,
      },
    ],
  },
  {
    name: "unsticky",
    description: "Remove the sticky message.",
    options: [
      {
        name: "channel",
        type: 7, // CHANNEL type
        description: "The channel where the sticky message will be removed.",
        required: true,
      },
    ],
  },
  {
    name: "create-vc",
    description: "Creates a temporary voice channel.",
    options: [
      {
        name: "channel_name",
        type: 3, // STRING type
        description: "The name of the voice channel.",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Registering Commands");
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Slash commands registered");
  } catch (error) {
    console.error(error);
  }
})();
