const ms = require("ms");
const { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder } = require("discord.js");

module.exports = {
    async open(interaction, Client) {
        if (!interaction.memberPermissions.has(8192n) || Client.guild.id !== interaction.guildId) return;
        if (interaction.targetMember.permissions.has(8192n))
            return interaction.reply({
                content: Client.locales.get("error/userlowerpermission"),
                ephemeral: true,
            });

        const customId = "silence" + String(Date.now());

        const modal = new ModalBuilder()
            .setCustomId(customId)
            .setTitle("Preencha as informações do silenciamento")
            .addComponents([
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("time")
                        .setLabel("Duração")
                        .setStyle("Short")
                        .setMinLength(2)
                        .setPlaceholder("1 hora")
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("reason")
                        .setLabel("Motivo")
                        .setStyle("Short")
                        .setMinLength(4)
                        .setPlaceholder("Spam")
                        .setRequired(true)
                ),
            ]);

        interaction.showModal(modal);

        const filter = (i) => i.customId === customId;
        interaction
            .awaitModalSubmit({ filter, time: 120000 })
            .then(async (res) => {
                let time = res.fields.getTextInputValue("time");
                const reason = res.fields.getTextInputValue("reason");

                time = ms(
                    time
                        .trim()
                        .replace(/minuto/g, "minute")
                        .replace(/hora/g, "hour")
                        .replace(/segundo/g, "second")
                        .replace(/dia/g, "day")
                );

                if (!time || time > 86400000 || time < 1000)
                    return res.reply({
                        content: Client.locales.get("error/invalidtime"),
                        ephemeral: true,
                    });

                const future_time = Math.floor((Date.now() + time) / 1000);

                let response = Client.locales.get("response/muted", {
                    user: interaction.targetUser.toString(),
                });

                await interaction.targetMember.timeout(time, reason).catch((error) => {
                    response = Client.locales.get("error/silence");
                    console.log(error);
                });

                const embed = new EmbedBuilder()
                    .setFooter({
                        text: interaction.user.tag + " (ID " + interaction.user.id + ")",
                        iconURL: interaction.user.displayAvatarURL(),
                    })
                    .setTitle("Castigo")
                    .setDescription(
                        Client.locales.get("punishment/mutedescription", {
                            userTag: interaction.targetUser.tag,
                            userId: interaction.targetUser.id,
                            time: future_time,
                        })
                    )
                    .setThumbnail(interaction.targetUser.displayAvatarURL())
                    .addFields([{ name: "Motivo", value: reason }])
                    .setColor(Client.locales.get("common/embedcolor"));

                Client.modLogChannel.send({
                    embeds: [embed],
                });

                res.reply({
                    content: response,
                    ephemeral: true,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    },
};
