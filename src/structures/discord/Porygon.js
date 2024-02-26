const { Client } = require("discord.js");
const Firebase = require("../database/Firebase");
const ContentBlock = require("../cdn/ContentBlock");
const Locales = require("../cdn/Locales");

module.exports = class DiscordClient extends Client {
    constructor() {
        super({
            intents: [process.env.INTENTS],
        });

        super.login(process.env.PORYGON_TOKEN);

        this.acess = process.env.ACESS.split(" ");
        this.commands = {};
        this.contextMenuCommands = {};

        async function loadModules(instance) {
            console.log("Connecting on Firebase...");
            instance.database = await new Firebase();

            console.log("Loadding ContentBlockModule...");
            instance.contentBlock = new ContentBlock(instance);

            console.log("Loadding Locales...");
            instance.locales = new Locales(instance);
        }

        loadModules(this);

        require("../../utils/discord/handlers/command")(this);
        require("../../utils/discord/handlers/context")(this);
        require("../../utils/discord/handlers/event")(this);
    }

    get guild() {
        return this.guilds.cache.get("723727866164019232"); 
    }

    get privateLogChannel() {
        return this.channels.cache.get("880994376417943573");
    }

    get modLogChannel() {
        return this.channels.cache.get("1033863334631583785");
    }
};
