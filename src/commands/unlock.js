module.exports = {
    aliase: "u",

    open(data, Client) {
        if (!Client.acess.includes(data.message.author.id)) return;
        if (Client.guild.id !== data.message.guild.id) return;

        data.message.channel.permissionOverwrites.edit(Client.guild.id, {
            SendMessages: true,
        });

        data.message.react("👍");
    },
};
