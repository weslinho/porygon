const firebase = require("firebase");

module.exports = class Database {
    constructor() {
        async function load(instance) {
            const fconfig = JSON.parse(process.env.FIREBASE_CREDENTIALS);
            !firebase.apps.length ? await firebase.initializeApp(fconfig) : await firebase.app();

            instance.database = firebase.database();
            console.log("Linked with Firebase!");
        }

        load(this);
    }

    async get(arg) {
        const ref = await this.database.ref(arg);
        const snap = await ref.once("value");
        const result = await snap.val();

        return result;
    }

    update(arg, obj) {
        this.database.ref(arg).update(obj);

        return obj;
    }
};
