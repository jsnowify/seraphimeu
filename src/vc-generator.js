const { ChannelType } = require("discord.js");

module.exports = async (interaction) => {
  try {
    const channelName = interaction.options.getString("channel_name");

    const createdChannel = await interaction.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildVoice,
    });

    console.log("Created Channel:", createdChannel);

    await interaction.reply(
      `Voice channel **${channelName}** created successfully!`
    );
  } catch (error) {
    console.error("Error creating voice channel:", error);
    await interaction.reply(
      "Failed to create voice channel. Please check bot functionality."
    );
  }
};
