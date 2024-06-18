const {
  Client,
  IntentsBitField,
  ActivityType,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const axios = require("axios");
const { token } = require("../private");
const registerCommands = require("./register-commands");
const handleVCCommand = require("./vc-generator"); // Import the vc-generator function

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

let stickyMessages = new Map(); // Map to store the sticky message content and its ID

client.on("ready", async (c) => {
  console.log(`✅ ${c.user.username} is online!`);
  try {
    await c.user.setActivity("Snowi", {
      type: ActivityType.Listening,
    });
    console.log("Activity set successfully");
  } catch (error) {
    console.error("Error setting activity:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case "hello":
        await interaction.reply("world!");
        break;
      case "seraphim":
        await interaction.reply(
          "Seraphim Euphony is a Mobile Legends team based in the Philippines, managed by Snowi. The team was established in April 2024."
        );
        break;
      case "zira":
        await interaction.reply(
          "Zira Esports is a Mobile Legends team based in the Philippines, managed by Snowi. The team was established in December 2023."
        );
        break;
      case "moon":
        await interaction.reply("About Moon Nickname");
        break;
      case "create-vc":
        await handleVCCommand(interaction); // Use the handleVCCommand function here
        break;
      case "meme":
        const memeResponse = await axios.get(
          "https://api.imgflip.com/get_memes"
        );
        if (memeResponse.data.success) {
          const memes = memeResponse.data.data.memes;
          const randomMeme = memes[Math.floor(Math.random() * memes.length)];
          const memeEmbed = new EmbedBuilder()
            .setTitle(randomMeme.name)
            .setImage(randomMeme.url)
            .setFooter({ text: `Meme ID: ${randomMeme.id}` });

          await interaction.reply({ embeds: [memeEmbed] });
        } else {
          await interaction.reply(
            "Failed to fetch memes. Please try again later."
          );
        }
        break;
      case "avatar":
        const user = interaction.options.getUser("user") || interaction.user;
        const avatarURL = user.displayAvatarURL({
          dynamic: true,
          size: 2048,
        });
        const avatarEmbed = new EmbedBuilder()
          .setTitle(`${user.username}'s Avatar`)
          .setImage(avatarURL);

        await interaction.reply({ embeds: [avatarEmbed] });
        break;
      case "sticky":
        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
          await interaction.reply(
            "You don't have permission to use this command."
          );
          return;
        }

        const stickyMessage = interaction.options.getString("message");
        const stickyChannel = interaction.options.getChannel("channel");

        if (stickyChannel.type !== ChannelType.GuildText) {
          await interaction.reply(
            "The specified channel is not a text channel."
          );
          return;
        }

        stickyMessages.set(stickyChannel.id, {
          content: stickyMessage,
          messageId: null,
        });

        await interaction.reply("Sticky message set successfully.");
        break;
      case "unsticky":
        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
          await interaction.reply(
            "You don't have permission to use this command."
          );
          return;
        }

        const unstickyChannel = interaction.options.getChannel("channel");

        if (unstickyChannel.type !== ChannelType.GuildText) {
          await interaction.reply(
            "The specified channel is not a text channel."
          );
          return;
        }

        const stickyInfo = stickyMessages.get(unstickyChannel.id);
        if (stickyInfo && stickyInfo.messageId) {
          const messageToDelete = await unstickyChannel.messages.fetch(
            stickyInfo.messageId
          );
          if (messageToDelete) {
            await messageToDelete.delete();
          }
        }

        stickyMessages.delete(unstickyChannel.id);

        await interaction.reply("Sticky message removed successfully.");
        break;
      default:
        await interaction.reply("Unknown command");
    }
  } catch (error) {
    console.error("Error replying to interaction:", error);
    await interaction.reply(
      "There was an error while processing your command."
    );
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const stickyInfo = stickyMessages.get(message.channel.id);
  if (stickyInfo) {
    const { content, messageId } = stickyInfo;

    if (messageId) {
      try {
        const previousStickyMessage = await message.channel.messages.fetch(
          messageId
        );
        if (previousStickyMessage) {
          await previousStickyMessage.delete();
        }
      } catch (error) {
        console.error("Error deleting previous sticky message:", error);
      }
    }

    const sentMessage = await message.channel.send(content);
    stickyMessages.set(message.channel.id, {
      content,
      messageId: sentMessage.id,
    });
  }
});

client.login(token);
