module.exports = async (interaction, Client) => {
    if (interaction.isUserContextMenuCommand()) {
        const archive = Client.contextMenuCommands[interaction.commandName.split(" ")[0].toLowerCase()];

        if (archive) {
            archive.open(interaction, Client);
            console.log("log", `${interaction.user.tag} (${interaction.user.id}) - ${interaction.commandName}`);
        }
    }

    if (interaction.isButton()) {
        const archive = Client.contextMenuCommands[interaction.customId];

        if (archive) {
            archive.open(interaction, Client);
            console.log("log", `${interaction.user.tag} (${interaction.user.id}) - ${interaction.customId}`);
        }
    }
};
