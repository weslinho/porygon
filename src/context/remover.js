const { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder } = require("discord.js");

module.exports = {
    async open(interaction, Client) {
        if (!interaction.memberPermissions.has(8192n) || Client.guild.id !== interaction.guildId) return;
        if (!interaction.targetMember.communicationDisabledUntil)
            return interaction.reply({
                content: Client.locales.get("error/incorrectusage"),
                ephemeral: true,
            });
        if (interaction.targetMember.permissions.has(8192n))
            return interaction.reply({
                content: Client.locales.get("error/userlowerpermission"),
                ephemeral: true,
            });

        const customId = "unsilence" + String(Date.now());

        const modal = new ModalBuilder()
            .setCustomId(customId)
            .setTitle("Preencha as informações")
            .addComponents([
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("reason")
                        .setLabel("Motivo")
                        .setStyle("Short")
                        .setMinLength(4)
                        .setPlaceholder("Silenciei por engano")
                        .setRequired(true)
                ),
            ]);

        interaction.showModal(modal);

        const filter = (i) => i.customId === customId;
        interaction
            .awaitModalSubmit({
                filter,
                time: 120000,
            })
            .then(async (res) => {
                const reason = res.fields.getTextInputValue("reason");

                let response = Client.locales.get("response/unmuted", {
                    user: interaction.targetUser.toString(),
                });

                await interaction.targetMember.timeout(null, reason).catch((error) => {
                    response = Client.locales.get("error/silence");
                    console.log(error);
                });

                const embed = new EmbedBuilder()
                    .setFooter({
                        text: interaction.user.tag + " (ID " + interaction.user.id + ")",
                        iconURL: interaction.user.displayAvatarURL(),
                    })
                    .setTitle("Remoção de castigo")
                    .setDescription(
                        Client.locales.get("punishment/unmutedescription", {
                            userTag: interaction.targetUser.tag,
                            userId: interaction.targetUser.id,
                        })
                    )
                    .setThumbnail(interaction.targetUser.displayAvatarURL())
                    .addFields([
                        {
                            name: "Motivo",
                            value: reason,
                        },
                    ])
                    .setColor(Client.locales.get("common/embedcolor"));

                Client.modLogChannel.send({
                    embeds: [embed],
                });

                res.reply({
                    content: response,
                    ephemeral: true,
                });
            })
            .catch((error) => console.log(error));
    },
};
