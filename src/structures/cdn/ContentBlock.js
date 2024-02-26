class cBM {
    constructor(Client) {
        this.client = Client;
        this.config();
    }

    async config() {
        this.channels = await this.client.database.get("CdN/Modules/ContentBlocker/Channels");
        this.ids = Object.values(this.channels);
    }

    async push(name, id) {
        const obj = new Object();
        obj[name] = id;

        await this.client.database.update("CdN/Modules/ContentBlocker/Channels", obj);
        this.config();
    }

    async remove(name) {
        const obj = new Object();
        obj[name] = null;

        await this.client.database.update("CdN/Modules/ContentBlocker/Channels", obj);
        this.config();
    }
}

module.exports = cBM;
