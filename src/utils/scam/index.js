const exerra = require("./tools/exerra");
const steam = require("./tools/steam");

async function scamFinder(message, Client) {
    const exerraFetch = await exerra(message, Client);
    const steamFetch = await steam(message, Client);

    if (exerraFetch || steamFetch) return exerraFetch ? exerraFetch : steamFetch;
}

module.exports = scamFinder;
