const fetch = require("node-fetch");

async function exerraScanner(message) {
    const messageUrls = message.match(/(?:[A-z0-9](?:[A-z0-9-]{0,61}[A-z0-9])?\.)+[A-z0-9][A-z0-9-]{0,61}[A-z0-9]/g);
    if (!messageUrls) return;

    for (let i = 0; i < messageUrls.length; i++) {
        const baddomain = await apiRequest(messageUrls[i].replace(/\[|\]/g, ""));
        if (baddomain) return baddomain;
    }
}

async function apiRequest(url) {
    const resp = await fetch("https://api.exerra.xyz/v2/scam?url=https://" + url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (r) => {
            const response = await r.json();

            if (response.status !== 200) return;
            if (response.data.isScam) return response.data.domain;
        })
        .catch((error) => {
            console.log(error);
        });

    return resp ? resp : undefined;
}

module.exports = exerraScanner;
