module.exports = async (Client) => {
    await Client.guild.members.fetch();
    console.log("Online!");
};
