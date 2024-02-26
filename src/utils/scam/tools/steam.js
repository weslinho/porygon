async function steamScanner(message, Client) {
    const messageUrls = message.match(/(?:[A-z0-9](?:[A-z0-9-]{0,61}[A-z0-9])?\.)+[A-z0-9][A-z0-9-]{0,61}[A-z0-9]/g);
    if (!messageUrls) return;

    if (message.toLowerCase().match(new RegExp(Client.locales.get("flagged/steam"), "g")))
        return messageUrls[1] ? messageUrls[1] : messageUrls[0];
}

module.exports = steamScanner;
