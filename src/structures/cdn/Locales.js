class Locales {
    constructor(Client) {
        this.client = Client;
        this.update();
    }

    async update() {
        const values = await this.client.database.get("CdN/Locales");
        this.locales = values;
    }

    get(locale, placeholder = {}) {
        const entries = locale.split("/");
        let value = this.locales[entries[0]]?.[entries[1]] || this.get("error/locale");

        if (Object.entries(placeholder).length) value = value.replace(/\{(\w+)\}/g, (_, key) => placeholder[key]);
        return value;
    }
}

module.exports = Locales;
