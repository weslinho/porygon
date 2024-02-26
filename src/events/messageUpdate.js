const messageEvent = require("./messageCreate");

module.exports = async (oldMessage, newMessage, Client) => {
    messageEvent(newMessage, Client);
};
